# Right Sidebar Formatting

The right sidebar is edited with u5CMS WYSIWYG editor, and rendered in the React theme. For proper rendering, the content must follow this specific structure:

### 1. Section Headers
Use `<h2>` tags for main section titles (e.g., "Websites", "Direct access")
In u5CMS format:
```
[[[Direct access]]]
```
These become the main section headings with large, bold styling
### 2. Item Links
Use `<h3>` tags containing `<a>` links for clickable items. Place description text immediately after each `<h3>` element
Can be plain text or wrapped in `<p>` tags.

In u5CMS format:
```
[[ [eIAM-Release Plan:bitreleaseplan] ]]
The release notes describe changes to the eIAM service and new functionalities.
```
The link text becomes the item title with hover effects and arrow icons. The description text appears as gray descriptive text under each item.
### 3. Subtitles/Categories
Use `<span class="bold">` for category labels (e.g., "Public:", "Internal:")
These appear as bold labels within sections.

In u5CMS format:
```
[b]Public:[/]
```
### 4. Direct Links (Alternative)
Standalone `<a>` tags (not inside `<h3>`) are also parsed, good for simple website links.
In u5CMS format:
```
[l:]https://www.bit.admin.ch[:l]
```


This ensures the content renders with the same professional styling and layout as the designed in the theme.