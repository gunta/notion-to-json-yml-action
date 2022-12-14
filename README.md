# Notion to Message Tokens JSON GitHub Action

Reads from a Notion Database and generates a Message Tokens JSON file.

## What is a Message Tokens?

```json
{
  "login.success": {
    "$comment": ["Comment"],
    "$value": {
      "detail": "ログインできました",
      "icon": "i-carbon-checkmark-filled",
      "level": "Success",
      "title": "認証できました"
    }
  },
  "payment": {
    "lowCredit": {
      "$type": "dialog",
      "$value": {
        "action": "Do you want to add credit?",
        "actionButton": "Add credit",
        "detail": "The balance is low.",
        "icon": "i-carbon-money",
        "level": "Warning",
        "title": "Low on credit"
      }
    },
    "requestTimeout": {
      "$type": "toast",
      "$value": {
        "action": "Please try the connection again.",
        "actionButton": "Try again",
        "detail": "We couldn't connect due to technical problems.",
        "icon": "i-carbon-wifi-off",
        "refIcon": "${icons}/connect.noWifi",
        "stack": "Error",
        "title": "Cannot connect"
      }
    }
  }
}
```

## Icons
```json
{
  "connect.noWifi": {
    "$type": "icon",
    "$value": {
      "iconifyIcon": "i-carbon-wifi-off",
      "awesomeIcon": "fa-sharp fa-solid fa-file",
      "appleSymbol": "person.fill.badge",
      "materialSymbol": "assistant_direction"
    }
  }
}
```

---
# Output

# Web
```javascript

console.log(payment.lowCredit.title) // Low on credit
console.log(payment.requestTimeout.icon) // i-carbon-wifi-off
console.log(payment.requestTimeout.refIcon.connect.noWifi)
console.log(payment.requestTimeout.refIcon) // i-carbon-wifi-off
```

# iOS

### Tokens.strings
```javascript
"payment.requestTimeout.title" = "Cannot connect"
"payment.requestTimeout.icon" = "person.fill.badge"
```

## SwiftUI
```swift
// Create a String extension for easier handling
extension String {
    var token: String {
        return NSLocalizedString(self, tableName: "Tokens.strings", bundle: Bundle.main, value: "", comment: "")
    }
}

View {
    VStack {
        Image(systemName: "payment.requestTimeout.icon".token)
            .imageScale(.large)
            .foregroundColor(.accentColor)
        Text("payment.requestTimeout.title".token)
    }
}
```

# Android

### res/values/tokens.xml
```xml
<?xml version="1.0" encoding="utf-8" ?>
<resources>
    <string name="payments_requestTimeout_title">Cannot connect</string>
    <string name="payments_requestTimeout_icon">assistant_direction</string>
</resources>
```

### sample.kt
```java
// In Android
String string = getResources().getString(R.string.payments_requestTimeout_title);
```

```kotlin
// In Android
val string: String = resources.getString(R.string.payments_requestTimeout_title);
```

# Flutter

## Samples
https://poeditor.com/localization/files/arb
https://github.com/google/app-resource-bundle/blob/master/arb_editor/resource.arb

### tokens.arb
```json
{
  "payment_lowCredit": "Low on credit by {credit}.",
  "@payment_lowCredit": {
    "type": "int",
    "title": "Low on credit",
    "context": "arb_tokens",
    "placeholders": {
      "credit": {
        "type": "Int",
        "description": "The remaining credit",
        "example": 50
      }
    }
  }
}
```

```dart
appBar: AppBar(
  title: Text(AppLocalizations.of(context)!.payment_lowCredit)
),
```


## What it does for you
1. Reads all the data from a Notion database
2. Based on Title, it generates a big object
2. Then it outputs a message tokens file based

## Inputs

### `notion-token`

**Required**

### `notion-db`

**Required**- 

### `output-file`

Path where the output file should be.

**Required**-

Example: `file.yml`

### `output-format`

**Optional**-

Currently, the following output formats are supported:
- **yml** / **yaml**
- **json**
- **json5**

The output format is automatically deduced from the file extension when not specified.

### `ignore-columns`

**Optional**

Array of columns to ignore from Notion.

### `camelcase-keys`

**Optional**

Default: `false`

Whether to transform keys to camelCase

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
    camelcase-keys: true

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

