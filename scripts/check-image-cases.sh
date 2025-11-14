#!/bin/bash
# Script to check for case mismatches between image references in markdown and git
# Usage: ./scripts/check-image-cases.sh

cd "$(dirname "$0")/.." || exit 1

echo "=== Checking for image case mismatches ==="
echo ""

mismatches=0
issues=()

# Find all markdown/html files
find blog -type f \( -name "*.md" -o -name "*.html" \) -print0 | while IFS= read -r -d '' md_file; do
  dir=$(dirname "$md_file")
  
  # Extract all image references
  grep -ohE 'img/[^" ]*\.(JPG|JPEG|PNG|WEBP|jpg|jpeg|png|webp)' "$md_file" 2>/dev/null | sort -u | while read img_ref; do
    full_path="$dir/$img_ref"
    
    # Check if git has this exact path (case-sensitive)
    if ! git ls-files "$full_path" >/dev/null 2>&1; then
      # Not found, try to find it case-insensitively
      basename_ref=$(basename "$img_ref")
      git_files=$(git ls-files "$dir/img/" 2>/dev/null)
      
      if [ -n "$git_files" ]; then
        # Find matching file (case-insensitive)
        git_match=$(echo "$git_files" | grep -i "/$basename_ref$" | head -1)
        
        if [ -n "$git_match" ]; then
          git_basename=$(basename "$git_match")
          if [ "$git_basename" != "$basename_ref" ]; then
            line_num=$(grep -n "$img_ref" "$md_file" | head -1 | cut -d: -f1)
            echo "❌ MISMATCH in: $md_file (line $line_num)"
            echo "   Referenced: $img_ref"
            echo "   Git has:    $git_basename"
            echo "   Fix: Change '$img_ref' to '$git_basename'"
            echo ""
            mismatches=$((mismatches + 1))
          fi
        fi
      fi
    fi
  done
done

if [ $mismatches -eq 0 ]; then
  echo "✓ No case mismatches found!"
  exit 0
else
  echo "Found $mismatches case mismatch(es) - fix these before deploying!"
  exit 1
fi

