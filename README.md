## `tailwrap`

Break tailwindcss classes into human-line-of-sight.

### Usage

Make this:

```
"inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
```

Become this:

```JS
classNames(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors",
  "hover:opacity-90",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
)
```
