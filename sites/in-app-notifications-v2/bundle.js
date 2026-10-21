/* @ds-bundle: {"format": 4, "namespace": "Eris", "components": [{"name": "Icon"}, {"name": "Button"}, {"name": "IconButton"}, {"name": "Input"}, {"name": "Checkbox"}, {"name": "Radio"}, {"name": "Toggle"}, {"name": "Badge"}, {"name": "Tag"}, {"name": "Avatar"}, {"name": "AvatarGroup"}, {"name": "ProductLogo"}, {"name": "ChaosMark"}, {"name": "Modal"}, {"name": "Tabs"}, {"name": "SegmentedControl"}, {"name": "ProgressBar"}, {"name": "Slider"}, {"name": "Alert"}, {"name": "RenderCard"}]} */
(function () {
  var React = window.React;
  var h = React.createElement;
  var ICONS = {"add-create": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M 12.971 11.029 L 12.971 2 L 11.029 2 L 11.029 11.029 L 2 11.029 L 2 12.971 L 11.029 12.971 L 11.029 22 L 12.971 22 L 12.971 12.971 L 22 12.971 L 22 11.029 L 12.971 11.029 Z\"></path></svg>", "arrow-right": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M 6.276 21.555 L 14.828 13 L 6.276 4.445 L 7.724 3 L 17.724 13 L 7.724 23 L 6.276 21.555 Z\" transform=\"translate(0,-1)\"></path></svg>", "checkmark": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"></polyline></svg>", "chevron-down": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M 12.474 14.802 C 12.212 15.066 11.79 15.066 11.528 14.802 L 7.249 10.472 C 6.897 10.115 6.918 9.523 7.312 9.195 C 7.655 8.908 8.166 8.96 8.481 9.28 L 12 12.841 L 15.546 9.253 C 15.879 8.916 16.419 8.916 16.751 9.253 C 17.082 9.59 17.084 10.137 16.751 10.472 L 12.472 14.802 L 12.474 14.802 Z\"></path></svg>", "chevron-up": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"currentColor\" style=\"transform:rotate(180deg)\"><path d=\"M 12.474 14.802 C 12.212 15.066 11.79 15.066 11.528 14.802 L 7.249 10.472 C 6.897 10.115 6.918 9.523 7.312 9.195 C 7.655 8.908 8.166 8.96 8.481 9.28 L 12 12.841 L 15.546 9.253 C 15.879 8.916 16.419 8.916 16.751 9.253 C 17.082 9.59 17.084 10.137 16.751 10.472 L 12.472 14.802 L 12.474 14.802 Z\"></path></svg>", "close-delete": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M 21 4.594 L 19.406 3 L 12 10.406 L 4.594 3 L 3 4.594 L 10.406 12 L 3 19.406 L 4.594 21 L 12 13.594 L 19.406 21 L 21 19.406 L 13.594 12 L 21 4.594 Z\"></path></svg>", "close": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 13.700 13.700\" fill=\"none\"> <path d=\"M 0.249 0.249 C 0.581 -0.083 1.119 -0.083 1.451 0.249 L 6.85 5.648 L 12.249 0.249 C 12.581 -0.083 13.119 -0.083 13.451 0.249 C 13.783 0.581 13.783 1.119 13.451 1.451 L 8.052 6.85 L 13.451 12.249 C 13.783 12.581 13.783 13.119 13.451 13.451 C 13.119 13.783 12.581 13.783 12.249 13.451 L 6.85 8.052 L 1.451 13.451 C 1.119 13.783 0.581 13.783 0.249 13.451 C -0.083 13.119 -0.083 12.581 0.249 12.249 L 5.648 6.85 L 0.249 1.451 C -0.083 1.119 -0.083 0.581 0.249 0.249 Z\" fill=\"currentColor\" fill-rule=\"evenodd\"></path> </svg>", "coat-material": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 20 20\" fill=\"none\"> <path d=\"M 7.874 3.028 C 5.754 3.672 4.008 5.292 3.208 7.36 C 3.098 7.644 3.238 7.962 3.522 8.072 C 3.588 8.098 3.654 8.11 3.72 8.11 C 3.94 8.11 4.148 7.976 4.232 7.758 C 4.912 6.004 6.394 4.628 8.194 4.082 C 8.484 3.994 8.648 3.686 8.56 3.396 C 8.472 3.106 8.164 2.942 7.874 3.03 L 7.874 3.028 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"></path> <path d=\"M 19.996 9.77 C 19.986 9.286 19.942 8.81 19.864 8.346 C 19.732 7.552 19.506 6.792 19.2 6.074 C 19.046 5.716 18.874 5.37 18.682 5.036 C 18.332 4.424 17.918 3.852 17.45 3.332 C 17.206 3.058 16.948 2.8 16.674 2.554 C 14.904 0.966 12.564 0 10 0 C 4.476 0 0 4.478 0 10 C 0 12.566 0.966 14.904 2.554 16.674 C 2.798 16.948 3.056 17.206 3.33 17.452 C 3.852 17.92 4.424 18.334 5.036 18.684 C 5.37 18.876 5.716 19.048 6.074 19.2 C 6.792 19.508 7.554 19.732 8.346 19.864 C 8.81 19.942 9.286 19.986 9.77 19.996 C 9.846 20 9.924 20 10 20 C 15.522 20 20 15.524 20 10 C 20 9.924 20 9.846 19.996 9.77 Z M 1.1 10 C 1.1 5.094 5.092 1.1 10 1.1 C 12.256 1.1 14.32 1.944 15.89 3.338 L 3.338 15.89 C 1.944 14.32 1.1 12.256 1.1 10 Z M 4.114 16.668 L 16.668 4.114 C 17.134 4.64 17.538 5.222 17.87 5.848 L 5.85 17.87 C 5.224 17.54 4.642 17.136 4.114 16.668 Z M 6.922 18.352 L 18.352 6.922 C 18.632 7.682 18.812 8.492 18.876 9.334 L 9.334 18.876 C 8.492 18.812 7.684 18.632 6.922 18.352 Z M 10.912 18.854 L 18.854 10.912 C 18.426 15.094 15.092 18.426 10.912 18.854 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"></path> </svg>", "fly": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 20 19.409\" fill=\"none\"> <path d=\"M 19.889 4.3 C 19.824 4.044 19.643 3.823 19.396 3.696 C 19.381 3.689 19.365 3.681 19.349 3.673 C 19.903 2.789 20.073 1.757 19.824 0.744 C 19.759 0.481 19.578 0.256 19.325 0.124 C 19.075 -0.006 18.773 -0.035 18.499 0.043 L 10.035 2.503 C 7.153 3.341 3.784 5.349 2.952 8.491 C 1.494 9.61 0.563 10.91 0.187 12.356 C 0.145 12.517 0.11 12.687 0.08 12.872 C -0.098 13.941 0.021 15.08 0.431 16.255 L 0.83 17.385 C 1.088 18.125 1.648 18.731 2.408 19.086 C 2.859 19.297 3.36 19.409 3.861 19.409 C 4.187 19.409 4.514 19.362 4.832 19.269 L 13.199 16.839 C 14.343 16.508 15.274 15.79 15.824 14.817 C 16.169 14.21 16.341 13.535 16.327 12.861 C 18.452 12.056 19.568 9.898 18.897 7.896 C 19.836 6.902 20.207 5.564 19.888 4.3 L 19.889 4.3 Z M 16.44 7.841 L 10.99 9.424 L 11.439 10.701 L 17.635 8.9 C 17.716 9.996 17.061 11.044 15.964 11.543 L 15.952 11.549 L 15.915 11.565 C 15.791 11.618 15.661 11.665 15.526 11.705 L 7.157 14.137 C 6.711 14.265 6.238 14.229 5.822 14.034 C 5.41 13.841 5.106 13.513 4.966 13.113 L 4.569 11.985 C 4.224 10.997 4.126 10.054 4.277 9.184 C 4.297 9.069 4.323 8.949 4.356 8.815 C 4.37 8.758 4.386 8.703 4.406 8.643 C 4.467 8.436 4.546 8.229 4.64 8.026 C 4.686 7.925 4.735 7.829 4.786 7.732 L 4.836 7.643 L 4.879 7.572 C 4.879 7.572 4.891 7.553 4.895 7.547 C 5.011 7.347 5.145 7.152 5.297 6.963 L 5.386 6.852 C 5.459 6.764 5.536 6.677 5.617 6.59 C 5.652 6.551 5.688 6.513 5.727 6.474 C 5.775 6.422 5.824 6.375 5.881 6.318 C 5.934 6.265 5.991 6.211 6.051 6.158 C 6.1 6.111 6.153 6.065 6.206 6.02 C 6.404 5.848 6.619 5.679 6.863 5.503 C 7.005 5.403 7.134 5.316 7.254 5.239 L 7.352 5.239 L 7.352 5.176 C 7.473 5.101 7.593 5.028 7.713 4.961 C 8.903 4.278 10.037 3.909 10.469 3.783 L 18.481 1.456 C 18.572 2.61 17.866 3.681 16.682 4.154 C 16.595 4.192 16.501 4.225 16.396 4.255 L 11.295 5.736 L 11.743 7.012 L 18.548 5.036 C 18.629 6.166 17.913 7.257 16.761 7.73 C 16.663 7.772 16.556 7.809 16.442 7.841 L 16.44 7.841 Z M 14.856 13.306 C 14.808 13.616 14.704 13.914 14.544 14.192 C 14.173 14.847 13.542 15.332 12.767 15.559 L 4.398 17.989 C 3.954 18.119 3.479 18.084 3.062 17.888 C 2.65 17.695 2.346 17.368 2.206 16.967 L 1.81 15.837 C 1.569 15.149 1.447 14.476 1.449 13.843 C 1.449 13.687 1.457 13.537 1.471 13.399 C 1.494 13.148 1.536 12.904 1.597 12.671 C 1.796 11.904 2.194 11.182 2.784 10.521 C 2.834 11.135 2.972 11.764 3.195 12.401 L 3.591 13.531 C 3.853 14.273 4.414 14.878 5.171 15.231 C 5.915 15.581 6.782 15.65 7.595 15.417 L 14.856 13.306 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"></path> </svg>", "hdri": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 20 15.064\" fill=\"none\"> <path d=\"M 5.307 7.69 C 6.622 7.69 7.692 6.62 7.692 5.305 C 7.692 3.99 6.622 2.92 5.307 2.92 C 3.992 2.92 2.922 3.99 2.922 5.305 C 2.922 6.62 3.992 7.69 5.307 7.69 Z M 5.307 4.265 C 5.881 4.265 6.349 4.733 6.349 5.307 C 6.349 5.882 5.881 6.349 5.307 6.349 C 4.732 6.349 4.264 5.882 4.264 5.307 C 4.264 4.733 4.732 4.265 5.307 4.265 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"></path> <path d=\"M 19.021 0 L 0.981 0 C 0.44 0 0 0.44 0 0.979 L 0 14.083 C 0 14.423 0.172 14.732 0.458 14.912 C 0.614 15.011 0.796 15.064 0.981 15.064 L 19.021 15.064 C 19.37 15.064 19.696 14.875 19.87 14.571 C 19.955 14.423 20 14.253 20 14.083 L 20 0.979 C 20 0.438 19.56 0 19.021 0 Z M 2.636 13.722 L 13.119 7.313 L 17.872 13.722 L 2.636 13.722 Z M 18.657 12.43 L 13.583 5.491 L 1.343 12.928 L 1.343 1.343 L 18.657 1.343 L 18.657 12.43 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"></path> </svg>", "info": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 20 20\" fill=\"none\"> <path d=\"M 18.605 10 C 18.605 5.248 14.752 1.395 10 1.395 C 5.248 1.395 1.395 5.248 1.395 10 C 1.395 14.752 5.248 18.605 10 18.605 C 14.752 18.605 18.605 14.752 18.605 10 Z M 20 10 C 20 15.523 15.523 20 10 20 C 4.477 20 0 15.523 0 10 C 0 4.477 4.477 0 10 0 C 15.523 0 20 4.477 20 10 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"></path> <path d=\"M 10 4.803 C 9.487 4.803 9.067 5.22 9.067 5.736 C 9.067 6.252 9.487 6.671 10 6.671 C 10.514 6.671 10.935 6.252 10.935 5.736 C 10.935 5.22 10.516 4.803 10 4.803 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"></path> <path d=\"M 10.592 8.008 L 9.408 8.008 C 9.328 8.008 9.263 8.073 9.263 8.154 L 9.263 15.052 C 9.263 15.132 9.328 15.197 9.408 15.197 L 10.592 15.197 C 10.672 15.197 10.737 15.132 10.737 15.052 L 10.737 8.154 C 10.737 8.073 10.672 8.008 10.592 8.008 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"></path> </svg>", "minus": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"5\" y1=\"12\" x2=\"19\" y2=\"12\"></line></svg>", "more": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><circle cx=\"5\" cy=\"12\" r=\"2\"></circle><circle cx=\"12\" cy=\"12\" r=\"2\"></circle><circle cx=\"19\" cy=\"12\" r=\"2\"></circle></svg>", "plus": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 14 14\" fill=\"none\"> <path d=\"M 7.75 0 C 7.75 -0.414 7.414 -0.75 7 -0.75 C 6.586 -0.75 6.25 -0.414 6.25 0 L 7.75 0 Z M 6.25 14 C 6.25 14.414 6.586 14.75 7 14.75 C 7.414 14.75 7.75 14.414 7.75 14 L 6.25 14 Z M 0 6.25 C -0.414 6.25 -0.75 6.586 -0.75 7 C -0.75 7.414 -0.414 7.75 0 7.75 L 0 6.25 Z M 14 7.75 C 14.414 7.75 14.75 7.414 14.75 7 C 14.75 6.586 14.414 6.25 14 6.25 L 14 7.75 Z M 6.25 0 L 6.25 14 L 7.75 14 L 7.75 0 L 6.25 0 Z M 0 7.75 L 14 7.75 L 14 6.25 L 0 6.25 L 0 7.75 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"></path> </svg>", "resolution": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 20 20\" fill=\"none\"> <path d=\"M 0 0 L 0 4.6 L 1.398 4.6 L 1.398 1.438 L 4.6 1.391 L 4.6 0 L 0 0 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"></path> <path d=\"M 15.399 0 L 15.399 1.402 L 18.586 1.402 L 18.605 4.6 L 19.999 4.6 L 19.999 0 L 15.399 0 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"></path> <path d=\"M 18.582 18.597 L 15.399 18.597 L 15.399 20 L 19.999 20 L 19.999 15.4 L 18.607 15.4 L 18.582 18.597 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"></path> <path d=\"M 1.395 15.4 L 0 15.4 L 0 20 L 4.6 20 L 4.6 18.613 L 1.41 18.591 L 1.395 15.4 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"></path> <path d=\"M 0 0 L 1.4 0 L 1.4 1 L 1 1 L 1 1.4 L 0 1.4 L 0 0 Z M 0 18.6 L 0 20 L 1.4 20 L 1.4 19 L 1 19 L 1 18.6 L 0 18.6 Z M 18.6 20 L 19.999 20 L 20 18.6 L 19 18.6 L 19 19 L 18.6 19 L 18.6 20 Z M 20 1.4 L 19.999 0 L 18.6 0 L 18.6 1 L 19 1 L 19 1.4 L 20 1.4 Z M 3 0 L 3 1.4 L 5 1.4 L 5 0 L 3 0 Z M 7 0 L 7 1.4 L 9 1.4 L 9 0 L 7 0 Z M 11 0 L 11 1.4 L 13 1.4 L 13 0 L 11 0 Z M 15 0 L 15 1.4 L 17 1.4 L 17 0 L 15 0 Z M 20 3 L 18.6 3 L 18.6 5 L 20 5 L 20 3 Z M 20 7 L 18.6 7 L 18.6 9 L 20 9 L 20 7 Z M 20 11 L 18.6 11 L 18.6 13 L 20 13 L 20 11 Z M 20 15 L 18.6 15 L 18.6 17 L 20 17 L 20 15 Z M 17 20 L 17 18.6 L 15 18.6 L 15 20 L 17 20 Z M 13 20 L 13 18.6 L 11 18.6 L 11 20 L 13 20 Z M 9 20 L 9 18.6 L 7 18.6 L 7 20 L 9 20 Z M 5 20 L 5 18.6 L 3 18.6 L 3 20 L 5 20 Z M 0 17 L 1.4 17 L 1.4 15 L 0 15 L 0 17 Z M 0 13 L 1.4 13 L 1.4 11 L 0 11 L 0 13 Z M 0 9 L 1.4 9 L 1.4 7 L 0 7 L 0 9 Z M 0 5 L 1.4 5 L 1.4 3 L 0 3 L 0 5 Z\" fill=\"currentColor\" fill-rule=\"evenodd\"></path> <path d=\"M 11.833 8.167 L 1.5 8.167 L 1.5 18.5 L 11.833 18.5 L 11.833 8.167 Z M 0 6.667 L 0 20 L 13.333 20 L 13.333 6.667 L 0 6.667 Z\" fill=\"currentColor\" fill-rule=\"evenodd\"></path> </svg>", "search": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"11\" cy=\"11\" r=\"8\"></circle><line x1=\"21\" y1=\"21\" x2=\"16.65\" y2=\"16.65\"></line></svg>", "user": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 17.111 17.111\" fill=\"none\"> <path d=\"M -0.75 17.111 C -0.75 17.525 -0.414 17.861 0 17.861 C 0.414 17.861 0.75 17.525 0.75 17.111 L -0.75 17.111 Z M 16.361 17.111 C 16.361 17.525 16.697 17.861 17.111 17.861 C 17.525 17.861 17.861 17.525 17.861 17.111 L 16.361 17.111 Z M 0.75 17.111 C 0.75 13.23 3.896 10.083 7.778 10.083 L 7.778 8.583 C 3.068 8.583 -0.75 12.401 -0.75 17.111 L 0.75 17.111 Z M 7.778 10.083 L 9.333 10.083 L 9.333 8.583 L 7.778 8.583 L 7.778 10.083 Z M 9.333 10.083 C 13.215 10.083 16.361 13.23 16.361 17.111 L 17.861 17.111 C 17.861 12.401 14.043 8.583 9.333 8.583 L 9.333 10.083 Z M 12.473 4.667 C 12.473 6.83 10.719 8.583 8.556 8.583 L 8.556 10.083 C 11.548 10.083 13.973 7.658 13.973 4.667 L 12.473 4.667 Z M 8.556 8.583 C 6.393 8.583 4.64 6.83 4.64 4.667 L 3.14 4.667 C 3.14 7.658 5.565 10.083 8.556 10.083 L 8.556 8.583 Z M 4.64 4.667 C 4.64 2.504 6.393 0.75 8.556 0.75 L 8.556 -0.75 C 5.565 -0.75 3.14 1.675 3.14 4.667 L 4.64 4.667 Z M 8.556 0.75 C 10.719 0.75 12.473 2.504 12.473 4.667 L 13.973 4.667 C 13.973 1.675 11.548 -0.75 8.556 -0.75 L 8.556 0.75 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"></path> </svg>"};
  var LOGOS = {"anima": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 26.667 26.667\" fill=\"none\"> <path d=\"M 13.333 0 C 5.967 0 0 5.967 0 13.333 C 0 20.7 5.967 26.667 13.333 26.667 C 20.7 26.667 26.667 20.7 26.667 13.333 C 26.667 5.967 20.7 0 13.333 0 Z M 17.617 16.5 C 17.617 16.633 17.533 16.75 17.417 16.8 L 7.217 21.333 C 7.05 21.417 6.9 21.333 6.9 21.183 L 6.9 5.55 C 6.9 5.383 7.05 5.25 7.217 5.333 L 17.417 10.083 C 17.533 10.133 17.617 10.25 17.617 10.383 L 17.617 16.5 Z M 23.067 14.25 L 19.783 15.733 C 19.667 15.783 19.55 15.7 19.55 15.583 L 19.55 11.333 C 19.55 11.2 19.683 11.133 19.8 11.183 L 23.1 12.717 C 23.733 13.017 23.733 13.95 23.067 14.25 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"></path> </svg>", "chaos-logo": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 34.323 9.676\" fill=\"none\"> <path d=\"M 32.34 5.7 C 31.557 5.617 30.907 5.317 30.907 5.05 C 30.907 4.65 31.34 4.583 31.607 4.583 C 31.857 4.583 32.423 4.633 32.423 5.167 C 32.423 5.217 32.457 5.25 32.49 5.25 L 34.173 5.25 C 34.207 5.25 34.24 5.217 34.24 5.167 C 34.24 3.883 33.14 3 31.573 3 C 30.023 3 28.907 3.883 28.907 5.1 C 28.907 6.15 30.223 6.883 31.457 7.017 C 32.007 7.083 32.34 7.35 32.34 7.55 C 32.34 7.883 31.94 8.067 31.573 8.067 C 31.423 8.067 30.69 8.033 30.69 7.483 C 30.69 7.433 30.657 7.4 30.623 7.4 L 28.923 7.4 C 28.89 7.4 28.857 7.433 28.857 7.483 C 28.857 8.917 30.24 9.65 31.59 9.65 C 32.94 9.65 34.323 8.9 34.323 7.483 C 34.34 6.4 33.34 5.817 32.34 5.7 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"></path> <path d=\"M 10.489 3 C 9.989 3 9.523 3.15 9.139 3.45 L 9.139 0.083 C 9.139 0.033 9.106 0 9.056 0 L 7.406 0 C 7.356 0 7.323 0.033 7.323 0.083 L 7.323 9.4 C 7.323 9.45 7.356 9.483 7.406 9.483 L 9.056 9.483 C 9.106 9.483 9.139 9.45 9.139 9.4 L 9.139 6.317 C 9.139 5.517 9.556 4.7 10.489 4.7 C 11.423 4.7 11.839 5.517 11.839 6.317 L 11.839 9.383 C 11.839 9.433 11.873 9.467 11.923 9.467 L 13.573 9.467 C 13.623 9.467 13.656 9.433 13.656 9.383 L 13.656 6.333 C 13.656 4.433 12.289 3 10.489 3 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"></path> <path d=\"M 19.239 6.333 C 19.239 7.233 18.539 7.95 17.673 7.95 C 16.806 7.95 16.106 7.217 16.106 6.333 C 16.106 5.45 16.806 4.717 17.673 4.717 C 18.539 4.717 19.239 5.433 19.239 6.333 Z M 17.639 3 C 15.789 3 14.289 4.5 14.289 6.333 C 14.289 8.167 15.789 9.667 17.639 9.667 C 18.256 9.667 18.856 9.35 19.289 8.817 L 19.289 9.4 C 19.289 9.45 19.323 9.483 19.373 9.483 L 20.923 9.483 C 20.973 9.483 21.006 9.45 21.006 9.4 L 21.006 6.333 C 20.989 4.5 19.489 3 17.639 3 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"></path> <path d=\"M 26.539 6.333 C 26.539 7.233 25.839 7.95 24.989 7.95 C 24.139 7.95 23.439 7.217 23.439 6.333 C 23.439 5.45 24.139 4.717 24.989 4.717 C 25.839 4.717 26.539 5.433 26.539 6.333 Z M 24.989 3 C 23.139 3 21.623 4.5 21.623 6.333 C 21.623 8.167 23.139 9.667 24.989 9.667 C 26.839 9.667 28.356 8.167 28.356 6.333 C 28.356 4.5 26.839 3 24.989 3 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"></path> <path d=\"M 3.99 7.833 C 3.123 8.2 2.123 7.783 1.807 6.9 C 1.523 6.117 1.89 5.233 2.64 4.867 C 3.207 4.6 3.84 4.683 4.307 5.033 C 4.357 5.067 4.407 5.067 4.457 5.05 L 5.857 4.45 C 5.94 4.417 5.973 4.3 5.907 4.217 C 4.94 3.067 3.273 2.65 1.84 3.367 C 0.307 4.133 -0.393 5.967 0.223 7.55 C 0.923 9.317 2.94 10.15 4.673 9.4 C 6.073 8.8 6.84 7.35 6.657 5.917 C 6.64 5.817 6.54 5.767 6.457 5.8 L 5.057 6.4 C 5.007 6.417 4.973 6.467 4.973 6.517 C 4.907 7.083 4.54 7.583 3.99 7.833 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"></path> </svg>", "cloud": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 26.667 26.600\" fill=\"none\"> <path d=\"M 13.333 0 C 5.967 0 0 5.967 0 13.333 C 0 20.267 5.3 25.967 12.067 26.6 C 12.033 26.317 12.017 26.017 12.017 25.733 C 12.017 21.533 15.417 18.133 19.617 18.133 C 21.617 18.133 23.433 18.9 24.783 20.167 C 25.983 18.167 26.667 15.833 26.667 13.35 C 26.667 5.967 20.7 0 13.333 0 Z M 8.633 17.233 C 6.183 17.233 4.183 15.25 4.183 12.783 C 4.183 10.317 6.167 8.333 8.633 8.333 C 11.083 8.333 13.083 10.317 13.083 12.783 C 13.083 15.25 11.083 17.233 8.633 17.233 Z M 15.733 7.383 C 14.45 7.383 13.417 6.35 13.417 5.067 C 13.417 3.783 14.45 2.75 15.733 2.75 C 17.017 2.75 18.05 3.783 18.05 5.067 C 18.033 6.35 17 7.383 15.733 7.383 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"></path> </svg>", "corona": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 26.667 26.667\" fill=\"none\"> <path d=\"M 24.4 6.217 C 24.484 6.2 24.534 6.083 24.484 6.017 C 22.1 2.4 18 0 13.334 0 C 12.517 0 11.717 0.083 10.95 0.217 C 10.867 0.233 10.817 0.333 10.867 0.417 C 14.75 7.333 17 8.283 24.4 6.217 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"></path> <path d=\"M 9.967 0.583 C 9.95 0.517 9.867 0.467 9.8 0.483 C 4.15 2.033 0 7.2 0 13.333 C 0 14.4 0.133 15.45 0.367 16.433 C 0.383 16.517 0.483 16.567 0.567 16.517 C 10.05 11.683 12.25 9.4 9.967 0.583 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"></path> <path d=\"M 20.883 24.1 C 20.917 24.183 21.017 24.217 21.1 24.167 C 24.467 21.75 26.667 17.8 26.667 13.333 C 26.667 11.1 26.117 9 25.15 7.15 C 25.1 7.05 24.967 7.017 24.867 7.067 C 17.85 11.5 17.9 15.017 20.883 24.1 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"></path> <path d=\"M 0.767 17.283 C 0.683 17.317 0.633 17.417 0.65 17.5 C 2.4 22.833 7.417 26.667 13.317 26.667 C 15.817 26.667 18.167 25.967 20.167 24.767 C 20.233 24.717 20.267 24.617 20.233 24.55 C 15.233 14.717 12.183 13.433 0.767 17.283 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"></path> <path d=\"M 15 13.433 C 16.27 13.433 17.3 12.404 17.3 11.133 C 17.3 9.863 16.27 8.833 15 8.833 C 13.73 8.833 12.7 9.863 12.7 11.133 C 12.7 12.404 13.73 13.433 15 13.433 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"></path> </svg>", "cylindo": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 26.667 26.667\" fill=\"none\"> <path d=\"M 13.334 0 C 5.97 0 0 5.97 0 13.334 C 0 20.697 5.97 26.667 13.334 26.667 C 20.697 26.667 26.667 20.697 26.667 13.334 C 26.667 5.97 20.697 0 13.334 0 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"></path> <path d=\"M 17.853 19.899 C 14.781 19.297 12.46 16.586 12.46 13.333 C 12.46 10.08 14.781 7.37 17.853 6.767 C 18.001 6.738 18.108 6.614 18.108 6.464 L 18.108 4.279 C 18.108 4.143 18.022 4.02 17.892 3.979 C 17.058 3.714 16.181 3.56 15.269 3.53 C 10.105 3.359 5.605 7.323 5.166 12.472 C 4.671 18.279 9.239 23.142 14.938 23.142 C 15.968 23.142 16.958 22.984 17.893 22.688 C 18.022 22.646 18.108 22.524 18.108 22.388 L 18.108 20.203 C 18.108 20.053 18.001 19.928 17.853 19.899 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"></path> <path d=\"M 18.086 8.814 C 16.177 9.429 14.793 11.223 14.793 13.334 C 14.793 15.444 16.177 17.238 18.086 17.853 C 18.288 17.918 18.497 17.769 18.497 17.555 L 18.497 9.112 C 18.497 8.899 18.288 8.749 18.086 8.814 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"></path> </svg>", "enscape": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 26.667 26.667\" fill=\"none\"> <path d=\"M 25.257 9.902 L 15.019 18.448 C 14.042 19.264 12.627 19.265 11.649 18.45 L 5.219 13.087 C 4.963 12.873 4.847 12.534 4.918 12.206 L 5.411 9.933 C 5.465 9.682 5.757 9.57 5.964 9.72 L 11.906 14.033 C 12.759 14.652 13.91 14.652 14.763 14.031 L 24.182 7.186 C 24.273 7.119 24.31 6.996 24.274 6.884 L 23.256 3.77 C 23.232 3.697 23.177 3.638 23.105 3.61 L 14.3 0.182 C 13.679 -0.06 12.991 -0.06 12.369 0.181 L 3.56 3.61 C 3.489 3.638 3.433 3.697 3.409 3.77 L 0.014 14.172 C -0.018 14.271 0.007 14.378 0.08 14.451 L 11.391 25.841 C 12.485 26.942 14.184 26.942 15.278 25.84 L 26.589 14.448 C 26.66 14.377 26.685 14.272 26.653 14.177 L 25.257 9.902 Z M 12.462 4.252 C 13.019 3.994 13.65 3.994 14.207 4.252 L 18.116 6.066 L 14.37 8.338 C 13.727 8.728 12.942 8.728 12.299 8.338 L 8.554 6.066 L 12.462 4.252 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"></path> </svg>", "phoenix": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 26.664 25.218\" fill=\"none\"> <path d=\"M 26.664 13.327 C 26.664 5.794 20.414 -0.289 12.814 0.011 C 5.931 0.277 0.314 5.861 0.014 12.744 C -0.136 16.027 0.914 19.061 2.747 21.444 C 3.047 21.827 3.397 21.761 3.531 21.294 C 4.497 17.977 7.014 14.961 9.614 13.061 C 8.531 11.961 8.197 10.927 8.014 9.327 C 8.464 9.844 9.131 10.894 10.447 10.844 C 7.964 8.577 8.331 4.994 8.331 4.994 C 8.331 4.994 9.381 7.344 11.797 7.877 C 10.197 6.177 9.397 4.027 10.564 1.577 C 10.797 3.711 12.247 4.711 13.814 6.061 C 14.497 6.644 15.247 7.177 15.964 7.727 C 17.814 9.177 19.764 10.527 21.481 12.111 C 22.981 13.494 23.581 15.327 23.147 17.577 C 21.181 14.944 17.997 14.544 15.897 15.611 C 13.897 16.627 12.947 19.077 13.664 21.511 C 13.947 22.461 14.481 23.361 15.447 24.127 C 15.747 24.361 16.047 24.561 16.381 24.744 C 17.697 25.444 19.281 25.361 20.531 24.544 C 24.231 22.161 26.664 18.027 26.664 13.327 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"></path> </svg>", "scans": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 26.633 26.667\" fill=\"none\"> <path d=\"M 16.733 19.733 C 16.866 19.75 16.983 19.7 17.083 19.583 L 26.1 9.583 C 25.916 8.967 25.7 8.383 25.433 7.8 L 16.466 19.067 C 16.316 19.233 16.35 19.5 16.516 19.633 C 16.583 19.7 16.65 19.733 16.733 19.733 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"></path> <path d=\"M 22.634 3.817 L 12.3 19.283 C 12.167 19.467 12.217 19.717 12.4 19.85 C 12.467 19.9 12.55 19.933 12.634 19.933 C 12.767 19.933 12.884 19.867 12.967 19.767 L 23.934 5.3 C 23.55 4.783 23.1 4.283 22.634 3.817 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"></path> <path d=\"M 9.283 19.767 L 20.6 2.183 C 18.5 0.8 16 0 13.3 0 C 6.233 0 0.433 5.517 0 12.467 L 9.283 19.767 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"></path> <path d=\"M 13.367 26.667 C 20.683 26.633 26.616 20.683 26.633 13.35 L 13.367 26.667 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"></path> <path d=\"M 0.167 15.617 C 1.05 20.767 4.9 24.917 9.9 26.233 L 0.167 15.617 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"></path> </svg>", "vantage": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 26.662 26.665\" fill=\"none\"> <path d=\"M 16.484 0.379 C 10.051 -1.204 3.334 2.296 0.917 8.479 C 0.284 10.113 -0.016 11.779 0.001 13.413 C 0.001 13.546 0.151 13.629 0.251 13.546 C 0.951 13.096 1.784 12.813 2.667 12.813 C 2.684 12.813 2.717 12.813 2.734 12.813 C 2.734 12.429 2.784 12.029 2.901 11.629 C 3.551 9.629 5.701 8.496 7.717 9.129 C 7.917 9.196 8.101 9.279 8.284 9.363 C 9.734 6.463 13.101 4.946 16.301 5.929 C 19.634 6.963 21.584 10.363 20.884 13.713 C 21.217 13.746 21.567 13.813 21.901 13.913 C 23.901 14.529 25.201 16.346 25.267 18.329 C 25.267 18.546 25.567 18.596 25.651 18.396 C 25.801 18.046 25.934 17.679 26.051 17.296 C 28.334 9.996 24.017 2.229 16.484 0.379 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"></path> <path d=\"M 20.251 17.646 C 19.784 17.629 19.334 17.696 18.917 17.863 C 18.917 17.779 18.934 17.713 18.934 17.629 C 19.067 14.829 16.884 12.463 14.084 12.329 C 11.351 12.213 9.051 14.263 8.801 16.946 C 8.267 16.629 7.651 16.429 6.984 16.396 C 4.867 16.296 3.067 17.946 2.967 20.063 C 2.917 21.229 3.384 22.329 4.201 23.063 C 4.367 23.213 4.517 23.346 4.517 23.346 C 5.884 24.529 7.517 25.479 9.351 26.063 C 13.651 27.396 18.117 26.446 21.434 23.896 C 22.001 23.463 22.451 23.079 22.734 22.713 C 23.117 22.229 23.351 21.613 23.384 20.963 C 23.467 19.196 22.067 17.713 20.251 17.646 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"></path> </svg>", "vray": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 26.672 26.644\" fill=\"none\"> <path d=\"M 9.672 17.617 C 9.939 18 10.256 18.217 10.522 18.2 C 10.839 18.183 11.189 17.867 11.456 17.383 C 12.306 15.8 12.856 14.25 13.389 12.767 C 14.139 10.667 14.906 8.5 16.456 6.45 C 18.089 4.317 20.672 3.483 21.622 3.25 C 21.772 3.217 21.806 3.033 21.689 2.933 C 19.389 1.1 16.506 0 13.356 0 C 11.806 0 10.322 0.267 8.939 0.75 C 7.239 1.35 6.089 2.95 6.039 4.75 C 5.989 8.25 6.539 13.233 9.672 17.617 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"></path> <path d=\"M 22.072 6.333 C 20.656 6.517 19.606 7.533 18.989 8.35 C 17.739 10.017 17.106 11.767 16.372 13.817 C 15.789 15.417 15.206 17.083 14.239 18.883 C 13.439 20.367 12.156 21.883 10.722 21.983 C 10.639 21.983 10.572 21.983 10.489 21.983 C 9.189 21.983 7.939 20.683 7.072 19.45 C 3.856 14.933 2.956 10 2.856 6.183 C 2.856 5.833 2.406 5.717 2.206 6 C 0.306 8.767 -0.578 12.633 0.406 16.533 C 1.656 21.517 5.689 25.267 10.322 26.3 C 18.989 28.25 26.672 21.65 26.672 13.3 C 26.672 11.617 26.356 10.017 25.789 8.533 C 25.372 7.45 24.456 6.617 23.322 6.367 C 22.922 6.3 22.489 6.283 22.072 6.333 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"></path> </svg>"};
  var PRODUCTS = {
    vray: 'V-Ray', corona: 'Corona', enscape: 'Enscape', phoenix: 'Phoenix', vantage: 'Vantage',
    anima: 'Anima', cylindo: 'Cylindo', cloud: 'Chaos Cloud', scans: 'Chaos Scans'
  };
  function cx() {
    var out = [];
    for (var i = 0; i < arguments.length; i++) if (arguments[i]) out.push(arguments[i]);
    return out.join(' ');
  }
  function isColor(v) { return typeof v === 'string' && /^(#|rgb|hsl|var\()/.test(v); }

  // ───────── Icon ─────────
  function Icon(props) {
    var name = props.name, size = props.size == null ? 16 : props.size;
    var style = Object.assign({ width: size, height: size }, props.style);
    if (ICONS[name]) {
      return h('span', { className: cx('er-icon', props.className), style: style, 'aria-hidden': props.title ? undefined : 'true', title: props.title, dangerouslySetInnerHTML: { __html: ICONS[name] } });
    }
    if (typeof name === 'string') {
      return h('img', { className: cx('er-icon er-icon-img', props.className), src: name, alt: '', style: style });
    }
    return null;
  }
  function renderIcon(icon, size) {
    if (icon == null || icon === false) return null;
    if (typeof icon === 'string') return h(Icon, { name: icon, size: size });
    return icon;
  }

  // ───────── Button ─────────
  function Button(props) {
    var size = props.size || 'm', variant = props.variant || 'primary';
    return h('button', {
      type: props.type || 'button', onClick: props.onClick, disabled: props.disabled, title: props.title,
      className: cx('er-btn', 'er-btn-' + size, 'er-btn-' + variant, props.className)
    }, renderIcon(props.icon, 14), props.children);
  }

  // ───────── IconButton ─────────
  function IconButton(props) {
    var size = props.size || 32;
    return h('button', {
      type: 'button', onClick: props.onClick, title: props.title, 'aria-label': props.title, 'aria-pressed': props.active ? 'true' : undefined,
      className: cx('er-iconbtn', props.active && 'is-active', props.className),
      style: { width: size, height: size }
    }, renderIcon(props.icon, 16));
  }

  // ───────── Input ─────────
  function Input(props) {
    var control = h('span', { className: 'er-input-wrap' },
      props.icon ? h('span', { className: 'er-input-icon' }, renderIcon(props.icon, 14)) : null,
      h('input', {
        className: cx('er-input', props.icon && 'has-icon', props.error && 'is-error'),
        value: props.value, defaultValue: props.defaultValue, onChange: props.onChange,
        placeholder: props.placeholder, type: props.type || 'text', disabled: props.disabled,
        'aria-invalid': props.error ? 'true' : undefined
      }));
    return h('label', { className: cx('er-field', props.className), style: props.width ? { width: props.width } : undefined },
      props.label ? h('span', { className: 'er-field-label' }, props.label) : null,
      control,
      (props.help || props.error) ? h('span', { className: cx('er-field-help', props.error && 'is-error') }, props.error || props.help) : null);
  }

  // ───────── Checkbox / Radio / Toggle ─────────
  function Checkbox(props) {
    return h('label', { className: cx('er-ctrl', props.disabled && 'is-disabled', props.className) },
      h('input', { type: 'checkbox', className: 'er-sr', checked: !!props.checked, disabled: props.disabled, onChange: function (e) { props.onChange && props.onChange(e.target.checked); } }),
      h('span', { className: cx('er-checkbox', props.checked && 'is-on') }),
      props.label);
  }
  function Radio(props) {
    return h('label', { className: cx('er-ctrl', props.disabled && 'is-disabled', props.className) },
      h('input', { type: 'radio', className: 'er-sr', name: props.name, value: props.value, checked: !!props.checked, disabled: props.disabled, onChange: function () { props.onChange && props.onChange(props.value); } }),
      h('span', { className: cx('er-radio', props.checked && 'is-on') }),
      props.label);
  }
  function Toggle(props) {
    return h('label', { className: cx('er-ctrl', props.disabled && 'is-disabled', props.className) },
      h('input', { type: 'checkbox', role: 'switch', className: 'er-sr', checked: !!props.checked, disabled: props.disabled, onChange: function (e) { props.onChange && props.onChange(e.target.checked); } }),
      h('span', { className: cx('er-toggle', props.checked && 'is-on') }),
      props.label);
  }

  // ───────── Badge / Tag ─────────
  function Badge(props) {
    return h('span', { className: cx('er-badge', 'er-badge-' + (props.tone || 'blue'), props.className) }, props.children);
  }
  function Tag(props) {
    return h('span', { className: cx('er-tag', props.className) }, props.children,
      props.onRemove !== undefined ? h('button', { type: 'button', className: 'er-tag-x', 'aria-label': 'Remove', onClick: props.onRemove }, h(Icon, { name: 'close', size: 10 })) : null);
  }

  // ───────── Avatar / AvatarGroup ─────────
  function Avatar(props) {
    var size = props.size || 28, tone = props.tone || 'blue';
    var style = { width: size, height: size, fontSize: Math.round(size * 0.4) };
    if (isColor(tone)) style.background = tone;
    return h('span', { className: cx('er-avatar', !isColor(tone) && 'er-avatar-' + tone, props.className), style: style, title: props.title }, props.initials || '??');
  }
  function AvatarGroup(props) {
    return h('span', { className: cx('er-avatar-group', props.className) }, props.children);
  }

  // ───────── ProductLogo ─────────
  function ProductLogo(props) {
    var name = props.name || 'vray', size = props.size || 36;
    if (!LOGOS[name]) return null;
    return h('span', { className: cx('er-product', 'er-product-' + name, props.className), style: { width: size, height: size }, role: 'img', 'aria-label': PRODUCTS[name] },
      h('span', { className: 'er-product-mark', style: { width: size * 0.6, height: size * 0.6 }, dangerouslySetInnerHTML: { __html: LOGOS[name] } }));
  }
  function ChaosMark(props) {
    var size = props.size || 28;
    return h('span', { className: cx('er-chaos-mark', props.className), style: { width: size, height: size }, role: 'img', 'aria-label': 'Chaos' },
      h('span', { className: 'er-product-mark', style: { width: size * 0.64, height: size * 0.64 }, dangerouslySetInnerHTML: { __html: LOGOS['chaos-logo'] } }));
  }

  // ───────── Modal ─────────
  function Modal(props) {
    if (!props.open) return null;
    var accent = props.accent || 'accent';
    var icStyle = isColor(accent) ? { background: accent } : undefined;
    return h('div', { className: cx('er-scrim', props.className), onClick: props.onClose },
      h('div', { className: 'er-modal', role: 'dialog', 'aria-modal': 'true', 'aria-label': props.title, onClick: function (e) { e.stopPropagation(); } },
        h('div', { className: 'er-modal-head' },
          props.icon ? h('span', { className: cx('er-modal-ic', !isColor(accent) && 'er-modal-ic-' + accent), style: icStyle }, props.icon) : h('span'),
          h('button', { type: 'button', className: 'er-modal-x', 'aria-label': 'Close', onClick: props.onClose }, h(Icon, { name: 'close', size: 14 }))),
        h('div', { className: 'er-modal-body' },
          h('h3', { className: 'er-modal-title' }, props.title),
          h('div', { className: 'er-modal-text' }, props.children)),
        props.footer ? h('div', { className: 'er-modal-foot' }, props.footer) : null));
  }

  // ───────── Tabs / SegmentedControl ─────────
  function Tabs(props) {
    return h('div', { className: cx('er-tabs', props.className), role: 'tablist' },
      (props.items || []).map(function (it) {
        var on = props.value === it;
        return h('button', { key: it, type: 'button', role: 'tab', 'aria-selected': on ? 'true' : 'false', className: cx('er-tab', on && 'is-on'), onClick: function () { props.onChange && props.onChange(it); } }, it);
      }));
  }
  function SegmentedControl(props) {
    return h('div', { className: cx('er-seg', props.size === 's' && 'er-seg-s', props.block && 'er-seg-block', props.className), role: 'radiogroup' },
      (props.items || []).map(function (it) {
        var on = props.value === it;
        return h('button', { key: it, type: 'button', role: 'radio', 'aria-checked': on ? 'true' : 'false', className: cx(on && 'is-on'), onClick: function () { props.onChange && props.onChange(it); } }, it);
      }));
  }

  // ───────── ProgressBar / Slider ─────────
  function ProgressBar(props) {
    var v = Math.max(0, Math.min(100, props.value || 0));
    return h('div', { className: cx('er-progress', props.className) },
      props.label ? h('div', { className: 'er-progress-row' }, h('span', null, props.label), h('span', { className: 'er-mono' }, Math.round(v) + '%')) : null,
      h('div', { className: 'er-progress-track', role: 'progressbar', 'aria-valuenow': Math.round(v), 'aria-valuemin': 0, 'aria-valuemax': 100 },
        h('div', { className: 'er-progress-fill', style: { width: v + '%' } })));
  }
  function Slider(props) {
    var min = props.min == null ? 0 : props.min, max = props.max == null ? 100 : props.max;
    var value = props.value == null ? min : props.value;
    var pct = ((value - min) / (max - min)) * 100;
    var fmt = props.format || function (x) { return String(x); };
    return h('div', { className: cx('er-slider', props.className) },
      props.label ? h('div', { className: 'er-slider-label' }, props.label) : null,
      h('input', {
        type: 'range', className: 'er-slider-input', min: min, max: max, step: props.step || 1, value: value,
        'aria-label': props.label, disabled: props.disabled,
        style: { '--er-fill': pct + '%' },
        onChange: function (e) { props.onChange && props.onChange(Number(e.target.value)); }
      }),
      props.showValues === false ? null : h('div', { className: 'er-slider-row' }, h('span', null, fmt(min)), h('span', null, fmt(value)), h('span', null, fmt(max))));
  }

  // ───────── Alert ─────────
  function Alert(props) {
    var tone = props.tone || 'info';
    return h('div', { className: cx('er-alert', 'er-alert-' + tone, props.className), role: tone === 'danger' ? 'alert' : 'status' },
      h('span', { className: 'er-alert-ic' }),
      h('div', null, props.title ? h('b', { className: 'er-alert-title' }, props.title) : null, props.children ? h('p', { className: 'er-alert-text' }, props.children) : null));
  }

  // ───────── RenderCard ─────────
  function RenderCard(props) {
    var tone = props.statusTone || 'grey';
    return h('div', { className: cx('er-card', props.onClick && 'is-clickable', props.className), onClick: props.onClick },
      h('div', { className: 'er-card-thumb', style: props.thumb ? { background: props.thumb } : undefined }, props.thumbLabel ? h('span', { className: 'er-card-thumb-label' }, props.thumbLabel) : null),
      h('div', { className: 'er-card-body' },
        h('div', { className: 'er-card-title' }, props.title),
        h('div', { className: 'er-card-meta' }, props.meta),
        props.footnote ? h('div', { className: 'er-card-row' }, h('span', { className: 'er-card-foot' }, props.footnote), props.status ? h(Badge, { tone: tone }, props.status) : null)
          : (props.status ? h(Badge, { tone: tone }, props.status) : null)));
  }

  var api = {
    Icon: Icon, Button: Button, IconButton: IconButton, Input: Input, Checkbox: Checkbox, Radio: Radio, Toggle: Toggle,
    Badge: Badge, Tag: Tag, Avatar: Avatar, AvatarGroup: AvatarGroup, ProductLogo: ProductLogo, ChaosMark: ChaosMark,
    Modal: Modal, Tabs: Tabs, SegmentedControl: SegmentedControl, ProgressBar: ProgressBar, Slider: Slider,
    Alert: Alert, RenderCard: RenderCard,
    icons: Object.keys(ICONS), products: Object.keys(PRODUCTS)
  };
  window.Eris = Object.assign(window.Eris || {}, api);
})();
