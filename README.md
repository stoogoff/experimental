
# Experimental

An experimental minimalist Javascript framework for creating reactive UIs. Built out of a general frustration with the size and complexity of modern JS development.

When I started web development *at the end of the 20th century*, to write Javascript which would run in multiple browsers you'd need to do something like this:

```
function getElement(id) {
  if(document.getElementById) return document.getElementById(id)
  else if(document.all) return document.all[id]
  else if(document.layers) return document.layers[id]

  return null
}
```

*(anyone remember document.all and document.layers??)*

Nowadays that level of dysfunction is way behind us and Javascript is far more consistent across implementations. And yet we use such complex frameworks that sit in between our code and the browser. I miss the days of not having a build pipeline and being able to look at the code I'm writing to understand where an error is. This very small, very lightweight, very incomplete and untested framework is an experiment in rectifying that.
