#!/bin/bash

# Loop through each Markdown file in the directory
for file in *.md; do
    # Check if the file is a regular file
    if [ -f "$file" ]; then
        # Add front matter to the Markdown file
        echo "---" > temp_file
        echo "layout: tab.liquid" >> temp_file
        echo "band:" >> temp_file
        echo "song:" >> temp_file
        echo "tags: tab" >> temp_file
        echo "date: 2024-04-06" >> temp_file
        echo "---" >> temp_file
        cat "$file" >> temp_file
        mv temp_file "$file"
    fi
done


