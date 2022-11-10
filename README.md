# notion-to-json-yml-file

Reads from a Notion Database and auto generates a JSON/YML file.

What it does for you
1. Reads all the data from a Notion database
2. Based on Title, it generates a big object
2. Then it outputs a file based on the filename extension (ie. `.json`, `.yml`)

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

The output format is automatically deduced from the file extension when not specified.

## Example usage

```yaml
uses: actions/notion-to-file-github-pr@v1.1
with:
    notion-token: ${{ secrets.NOTION_TOKEN }}
    notion-db: ${{ secrets.NOTION_DATABASE }}
    output-file: 'notion.json'
```

# Making a PR based on the updates from Notion
```yaml
- name: Update file
  uses: ./
  id: notion-import
  with:
    notion-token: ${{ secrets.NOTION_TOKEN }}
    notion-db: ${{ secrets.NOTION_DATABASE }}
    output-file: './path/database.yml'
    output-format: 'yml'
    ignore-columns: |
      'Status'

- name: Create Pull Request
  uses: peter-evans/create-pull-request@v4
  with:
    commit-message: 'Update from Notion'
    branch: 'automation/update-from-notion'
    delete-branch: true
    title: 'Update from Notion'
    body: 'Automated changes by GitHub action'
    labels: 'automated-notion'
```
