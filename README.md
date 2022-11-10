# notion-to-file-github-pr

Reads from a Notion Database and auto generates a yml file, then creates a PR for it.

What it does for you
1. Reads all the data from a Notion database
2. Generates an output file based on the filename extension (ie. `.json`, `.yml`)
3. If there is no file, create it
4. If there is a file already, overwrites it
5. If there were any changes, commit them, if not, exit
6. Create a PR based on the file changes

## Inputs

### `notion-token`

**Required**

### `notion-db`

**Required**- 

### `output-file`

Path where the output file should be.

Example: `file.yml`

### `output-format`

Currently, the following output formats are supported:
- **yml** / **yaml**
- **json**
- **json5**

The output format is automatically deduced from the file extension if not specified.

## Format

Currently, it uses the Title as a key for output.


## Example usage

```yaml
uses: actions/notion-to-file-github-pr@v1.1
with:
    notion-token: ${{ secrets.NOTION_TOKEN }}
    notion-db: ${{ secrets.NOTION_DATABASE }}
    output-file: 'notion.json'
```

# 
