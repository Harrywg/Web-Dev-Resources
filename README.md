[View Hosted Site](https://web-design-resources.netlify.app/)
# Web Design Resources
## Technologies

1. JavaScript
2. HTML
3. CSS

## Overview
This is a REST API CRUD application build in JavaScript. I wanted to challenge myself to build something with the complexity of a framework app like a React project in plain JavaScript. I found myself often using online tools to help design my projects, and so I wanted to build a site that kept all of these tools in one place. This means that any friends, colleagues, or recruiters can add their own sites and tools that they use to help grow my web design resources empire!  

## My Process
### Animations
The most notable animation in this site is the 3d card animation. This is using javascript to track the position of the mouse relative to the element, and programmatically change the rotateX rotateY transform CSS property in the elements style. There is also an element that is ofset to create a shine effect, which helps the illusion of 3d in the animation.  

### DOM Manipulation
When building an app without a framework, it quickly becomes difficult to keep track of any DOM changes that you have made. React solves this with state management and the React DOM allowing the developer to easily keep track of changes in the UI. With plain JavaScript it's important to make sure that you are changing all of the correct properties when the UI changes, and that when you revert that change all of those changes are also reverted. The only real solution to this without building my own pseudo-framework is to make sure all of the code is clean and affects all of the right properties.
