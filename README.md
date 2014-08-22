dirtyForm.js
============

A jQuery plugin to help you determine if the user has made any changes to your forms

## Quick Start
Include the plugin on your page
```html
<script src="dirtyForm.js"></script>
```

Then attach it to a form:
```javascript
$('#my_form').dirtyForm();
```

Now whenever value of any of the form's fields(`input`, `select`, and `textarea` elements) change, the changed element and the form will gain a 'dirty' class.

See the demo page for a full example.

## Options
You can optionally pass in an options object to dirtyForm()
```javascript
$('#my_form').dirtyForm({dirtyClass: 'changed'});
```

Here are the accepted options:

Name | Default | Description
----|----|----
selector|"input, select, textarea"|The selector used to determine which elements changes will be detected on
dirtyClass|"dirty"|The class that is added to the form and it's elements when changes have occured.
