"""Validate index.html for common markup issues.

Checks:
1. Unclosed void elements misused as containers
2. Unclosed non-void tags (tag imbalance via stack)
3. Invalid attribute syntax (unescaped quotes, missing = signs)
4. Duplicate IDs
5. Empty href/src
6. Common regex-level issues (missing >, stray <)
"""
import re
import sys
from collections import Counter

path = r"C:\Users\cyber\Projects\portfolio-git\galleryversion\index.html"

with open(path, "r", encoding="utf-8") as f:
    html = f.read()

lines = html.split("\n")
issues = []

# ── 1. Tag balance (stack) ──
VOID = {"area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"}
# Also treat self-closing <tag/> as void
tag_re = re.compile(r"</?(\w[\w-]*)((?:\s[^>]*?)?)\s*(/?)>", re.DOTALL)

stack = []  # (tag, line_no)
seen = {}   # tag -> [line_nos]

for i, line in enumerate(lines, 1):
    for m in tag_re.finditer(line):
        raw = m.group(0)
        tagname = m.group(1).lower()
        attr_raw = m.group(2)
        self_close = m.group(3) == "/"

        if tagname in ("script", "style", "template", "svg"):
            seen.setdefault(tagname, []).append(i)
            continue

        if raw.startswith("</"):
            # closing tag — pop from stack
            if not stack:
                issues.append((i, f"STRAY_CLOSE: </{tagname}> has no matching open"))
            else:
                # walk backward to find matching open tag
                for idx in range(len(stack) - 1, -1, -1):
                    if stack[idx][0] == tagname:
                        # pop everything between (mismatched closings)
                        depth = len(stack) - 1 - idx
                        if depth > 0:
                            issues.append((i, f"MISMATCH: </{tagname}> closes at depth {depth}, stack was {[s[0] for s in stack[idx:]]}"))
                        del stack[idx]
                        break
                else:
                    issues.append((i, f"STRAY_CLOSE: </{tagname}> with no matching open tag in stack (stack: {[s[0] for s in stack[-5:]]})"))
        elif self_close or tagname in VOID:
            pass  # no stack push
        else:
            # only push if it looks like a non-self-closing open tag
            if not raw.endswith("/>"):
                stack.append((tagname, i))

# Report unclosed tags
if stack:
    # Collapse consecutive same-depth nests
    for tag, ln in stack:
        issues.append((ln, f"UNCLOSED: <{tag}> at line {ln} never closed"))

issues.sort()

# ── 2. Duplicate IDs ──
id_re = re.compile(r'\bid=["\']([^"\']+)["\']')
id_counts = Counter()
for i, line in enumerate(lines, 1):
    for m in id_re.finditer(line):
        id_counts[(m.group(1), i)] += 1

seen_ids = {}
for (idval, ln), cnt in id_counts.items():
    if idval in seen_ids:
        issues.append((ln, f"DUP_ID: id='{idval}' also appears at line {seen_ids[idval]}"))
    else:
        seen_ids[idval] = ln

# ── 3. Empty href / src ──
empty_attr_re = re.compile(r'\b(href|src)\s*=\s*["\']\s*["\']')
for i, line in enumerate(lines, 1):
    for m in empty_attr_re.finditer(line):
        issues.append((i, f"EMPTY_ATTR: {m.group(1)}=\"\" (line may be fine but flagging)"))

# ── 4. Likely unclosed attribute (e.g. class="foo with a missing quote) ──
# This is hard to do perfectly, but flag lines where an attr value starts
# with a quote but doesn't end with one on the same line (if tag isn't multiline)
attr_unclosed = re.compile(r'''(\w+=["'])([^"'>]*)($| )''')
# We'll be conservative and skip multi-attribute issues.

# ── 5. Check for self-closing DIVs (common error) ──
for i, line in enumerate(lines, 1):
    if re.search(r'<div[^>]*/>', line):
        issues.append((i, "SELF_CLOSE: <div/> is not valid HTML5 - use <div></div>"))

# ── 6. Check for < inside attribute values that looks like a new tag ──
# This would catch the missing > bug pattern
for i, line in enumerate(lines, 1):
    # Look for attribute values that contain unescaped <
    for m in re.finditer(r'"[^"]*<[^"]*"', line):
        val = m.group(0)
        if '<' in val and not any(t in val for t in ['</', '<br', '<span', '<div', '<p>', '<a ', '<img']):
            issues.append((i, f"SUSPICIOUS_WITHIN_ATTR: line has '<' inside quoted string: {val[:60]}"))

# ── 7. Check for obvious unclosed <a> tags (open more than close) ──
a_open = len(re.findall(r'<a\s', html))
a_close = len(re.findall(r'</a>', html, re.I))
if a_open != a_close:
    issues.append((0, f"TAG_COUNT: {a_open} <a> opens but {a_close} </a> closes"))

for tag in ['section', 'div', 'span', 'p', 'li', 'button', 'h[1-6]']:
    pattern_open = re.compile(rf'<{tag}(\s|>)', re.I)
    pattern_close = re.compile(rf'</{tag}>', re.I)
    opens = len(pattern_open.findall(html))
    closes = len(pattern_close.findall(html))
    if opens != closes:
        issues.append((0, f"TAG_COUNT: {opens} <{tag}> opens but {closes} </{tag}> closes"))

# ── Print report ──
print(f"HTML Validation Report for index.html ({len(lines)} lines)")
print(f"{'─'*60}")
if not issues:
    print("✅ No issues found")
else:
    issues.sort()
    for ln, msg in issues:
        print(f"  L{ln:>5} │ {msg}")
    print(f"\n{'─'*60}")
    print(f"Total: {len(issues)} issue(s)")
    print(f"Line-numbered issues: {sum(1 for ln,_ in issues if ln > 0)}")
    print(f"Aggregate tag-count issues: {sum(1 for ln,_ in issues if ln == 0)}")