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

### `output-path`

Path where the output file should be.

Example: `file.yml`

Currently, the following output formats are supported:
- **yml**

In the future the following formats will be supported:
- **json**
- **csv**
- **md**

The output format is deduced from the extension.

## Outputs

### `time`

The time we greeted you.

## Example usage

```yaml
uses: actions/notion-to-file-github-pr@v1.1
with:
  who-to-greet: 'Mona the Octocat'
```

# 
