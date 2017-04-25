# Chained

[![npm](https://img.shields.io/npm/v/jquery-chained.svg)](https://www.npmjs.com/package/jquery-chained)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.txt)
[![Build Status](https://img.shields.io/travis/tuupola/jquery_chained/master.svg?style=flat-square)](https://travis-ci.org/tuupola/jquery_chained)

Chained is simple plugin for chained selects. It works with both jQuery and Zepto. You can choose from two different versions. Use `jquery.chained.js` if you do not want to make external queries for setting content of child selects. This version uses data attirbutes to decide the content.

For more complex scenarios maintaining data attributes will get cumbersome. Also if you want to make queries against database use `jquery.chained.remote.js` instead. This version makes an external AJAX query and uses the returned JSON to build child selects.

## Install

You can install with [yarn](https://yarnpkg.com/), [npm](https://www.npmjs.com/) or [bower](http://bower.io/).

```
$ yarn add jquery-chained
$ npm install jquery-chained
$ bower install chained
```

## Simple usage

Child selects are chained to parent select. All selects must have an id attribute. Child select options must have class names which match option values of parent select. When user selects something in parent select the options in child select are updated. Options which have matching classname with parents currently selected option will stay visible. Others are hidden.

First you must include jQuery or Zepto and Chained in your code:

```html
<script src="jquery.js"></script>
<script src="jquery.chained.js"></script>
```

If you are using Zepto you must also include the optional selector module.

```html
<script src="zepto.js"></script>
<script src="zepto-selector.js"></script>
<script src="jquery.chained.js"></script>
```

Then lets assume you have the following HTML code:

```html
<select id="mark" name="mark">
    <option value="">--</option>
    <option value="bmw">BMW</option>
    <option value="audi">Audi</option>
</select>
<select id="series" name="series">
    <option value="">--</option>
    <option value="series-3" data-chained="bmw">3 series</option>
    <option value="series-5" data-chained="bmw">5 series</option>
    <option value="series-6" data-chained="bmw">6 series</option>
    <option value="a3" data-chained="audi">A3</option>
    <option value="a4" data-chained="audi">A4</option>
    <option value="a5" data-chained="audi">A5</option>
</select>
```

You can now chain the series to mark. There are two different ways to do it. Choose yourself if you prefer more english like or shorter version. I prefer the shorter version.

```javascript
$("#series").chained("#mark"); /* or $("#series").chainedTo("#mark");
```

## Chaining to multiple parents

One child can have two parents. Available options in child which is chained to multiple parents depend on one or both of the parents selected values. To make child select depend on values of both parents use data attribute like `first+second`.

Here is code for fourth select. Note how diesel engine is available only for BMW 3 and 5 series Sedans. This is achieved by using classnames `series-3+sedan` and `series-5+sedan`.

```html
<select id="engine" name="engine">
    <option value="">--</option>
    <option value="25-petrol" data-chained="series-3 a3 a4">2.5 petrol</option>
    <option value="30-petrol" data-chained="series-3 series-5 series-6 a3 a4 a5">3.0 petrol</option>
    <option value="30-diesel" data-chained="series-3+sedan series-5+sedan a5">3.0 diesel</option>
</select>
```
```javascript
$("#series").chained("#mark");
$("#model").chained("#series");
$("#engine").chained("#series, #model");
```

## Usage with AJAX

Using Remote Version
Using the remote version is similar to what has been explained above. First include jQuery or Zepto and remote version of Chained:

```html
<script src="jquery.js"></script>
<script src="jquery.chained.remote.js"></script>
```

In HTML you only need to provide option tags for the first select. Contents of other selects will be built from JSON returned by AJAX request. AJAX request is done when value of parent select changes.

```html
<select id="mark" name="mark">
    <option value="">--</option>
    <option value="bmw">BMW</option>
    <option value="audi">Audi</option>
</select>
<select id="series" name="series">
    <option value="">--</option>
</select>
<select id="model" name="model">
    <option value="">--</option>
</select>
<select id="engine" name="engine">
    <option value="">--</option>
</select>
```

In code you must use `remoteChained()` method. Second parameter is URL where the AJAX request is sent.

```javascript
$("#series").remoteChained({
    parents : "#mark",
    url : "/api/series"
});

$("#model").remoteChained({
    parents : "#series",
    url : "/api/models"
});

$("#engine").remoteChained({
    parents : "#series, #model",
    url : "/api/engines"
});
```

When change event is triggered on parent select a GET request is sent to the given URL. This request includes the name and value of the parent in the query string. For example when users selects BMW in the first select the following request is made:

```
GET http://example.com/api/series?mark=bmw
```

### JSON data format

By default chained can handle two different formats of JSON response. Object containing key + values pairs is easy to generate. However properties of an object in JavaScript do not have an order. Depending on browser select options might appear on different order.

```javascript
{
    "" : "--",
    "series-1" : "1 series",
    "series-3" : "3 series",
    "series-5" : "5 series",
    "series-6" : "6 series",
    "series-7" : "7 series",
    "selected" : "series-6"
}
```

If want to sort the entries on serverside to specific order use array of objects instead.

```javascript
[
    { "" : "--" },
    { "series-1" : "1 series" },
    { "series-3" : "3 series" },
    { "series-5" : "5 series" },
    { "series-6" : "6 series" },
    { "series-7" : "7 series" },
    { "selected" : "series-6" }
]
```

If you are accessing third party data source and do not have control over data structure you can use `data` function. It should mutate and return the json data in one of the above formats. Example below shows how you could mutate namespaced data to a format which plugin uderstands.

```javascript
{
    "data": [
        { "" : "--" },
        { "series-1" : "1 series" },
        { "series-3" : "3 series" },
        { "series-5" : "5 series" },
        { "series-6" : "6 series" },
        { "series-7" : "7 series" },
        { "selected" : "series-6" }
    ]
}
```

```javascript
$("#series").remoteChained({
    parents : "#mark",
    url : "/api/series"
    data: function (json) {
        return json.data;
    }
});
```

# License

All code licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php).

# Changelog

See [releases](https://github.com/tuupola/jquery_chained/releases).
