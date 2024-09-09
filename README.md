# Blogger Styling

Styled elements powered by web components.  
These components are created because I needed injectable scripts to manage custom styling and behavior in my code. They can be used directly in native HTML, and usage is simple—just include the script element in the head of your HTML.  
You can use these components like custom HTML elements, without needing frameworks like React or Vue, and there are no dependencies. Even if you import everything, the total size is only a few kilobytes.

## How to use

First, add the script element to your head:

```html
<head>
    <script type="module" crossorigin="anonymous"
        src="https://cdn.jsdelivr.net/npm/blogger-styling@1.2.1/dist/pre-styled_animated-details.js"></script>
</head>
```

Then, use the component in your HTML:

```html
<body>
<pre-styled-animated-details data-title="says">
    <ul>
        <li>Hello!</li>
    </ul>
</pre-styled-animated-details>
</body>
```

That's it!

## When to use

This can be used in the frontend of any web service, but it works particularly well with blogging platforms like Blogger. The only requirement is an environment that allows for customizable HTML resources.  
There’s no need for build tools, IDEs, or personal servers—just simple HTML.

## Note

You can import only the components you need.  
The dependency tree is modular, and the script element with `type=module` handles resolving dependencies between components.  
So, don't worry about conflicts or unnecessary code being loaded.

## More details

Detailed information about each component variant is available in the GitHub wiki. Please refer to it for more information.
