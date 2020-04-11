---
slug: programmatically-access-contact-form-7-form-fields
date: '2020-02-12'
title: 'Programmatically access Contact Form 7 form fields'
description: "If you want to access the fields of a form you've created in Contact form 7
there's good news and bad news. The bad news is it's not easy and quite a pain
to accomplish. The good news is this article guides you through the process."
categories: ['wordpress', 'tutorials']
redirects:
  - '/development/programmatically-access-contact-form-7-form-fields'
---

If you want to access the fields of a form you've created in Contact form 7
there's good news and bad news. The bad news is it's not easy and quite a pain
to accomplish. The good news is this article guides you through the process.

## Why would I want to access the field data of my form?

My use case for needing the form field data was because I was building something
in React and I wanted to submit a form on the front end via the contact form 7
endpoints provided by the WP Rest API. The problem was that I wasn't sure which
form would be used at run time so I needed information about the contact form
fields to produce a form that asked for the correct data. For me the solution
was to get the information about the form and pass that data to the frontend via
`wp_localize_script`.

## So how do we get the data about the form?

After some research I discovered that all cf7 forms are saved as posts under a
custom post type 'contact_forms' created by cf7. I also discovered a handy
function provided by contact form 7 called `wpcf7_contact_form` that when given
a form id will return information relating to the form. Problem solved! Let's
just get the fields...nope! Sadly all fields such as
`[text* someId class:some-class placeholder "Enter some info"]` are stored in
the post content and includes any html added when the form was created. This
actually makes a lot of sense when I think about it, but still didn't help in
accomplishing the goal...sad face. So how do we extract the information from the
content, the process I took was as follows:

1. Strip any unnecessary html/content from the form content leaving me with just
   the field shortcodes
2. Extract the field data from the shortcodes
3. Pass the field data to the frontend via `wp_localize_script`

### Stripping the unnecessary html/content

To strip out the unwanted content I wrote the following function
`just_shortcodes` that will return an array with each array item being the full
shortcode content minus the open and close square bracket.

```php
<?php
function just_shortcodes($str) {
    // First chop the string up by the end of the shortcode tag
    $arr = explode(']', strip_tags($str));
    // Then remove any excess by trimming the beginning of the tag
    $tags = array_map(function($item) {
        if(strpos($item, '[') === FALSE)
            return false;

        $str_arr = explode('[', $item);

        return  $str_arr[1];
    }, $arr);

    // remove any empty items
    $tags = array_filter($tags, function($item) {return !empty($item);});

    return $tags;
}
```

## Extracting the field data

I'm not going to lie, this was a pain and the code I wrote below could be
improved upon but done is better than perfect as they say. I created a function
`get_cf7_field_data_from_shortcodes` (which I have included below the
walkthrough) first splits the shortcode into an array wherever there is a space
as in this example:

```php
<?php

// 'text* someId class:some-class placeholder "Enter some info"' becomes

$result = [
  'text*',
  'someId',
  'class:some-class',
  'placeholder',
  '"Enter',
  'some',
  'info"'
]
```

For reference, the above was the starting point and this is what I wanted to get
to:

```php
<?php

$result = [
  'id' => 'someId',
  'required' => true,
  'type' => 'text',
  'copy' => 'Enter some info'
];
```

After splitting out the string into an array I needed information about the size
of the array to understand what to do next, this is because tags like `[submit]`
would result in an array with only one index. I also needed to catch when the
array length is larger than 1 but only because the user has added a class as in
`[submit class:some-class]` once that was done I had access to the field id (in
most cases, discussed later):

```php
<?php

$larger_than_one = array_key_exists(1, $atts);
// check for class and id ats as in [acceptance class:some-class]
$has_class = $larger_than_one && strpos( $atts[1], 'class:') !== false;
$has_id = $larger_than_one && strpos( $atts[1], 'id:') !== false;

$field_id = $larger_than_one && !$has_class && !$has_id ? $atts[1] : $atts[0];
```

Then I could work out if the field was required based on the existence of an
asterisk in the first array item. I also wanted the field to be considered
required if it was the `[acceptance]` tag.

```php
<?php

$is_required = strpos($atts[0], '*') !== false || $atts[0] === 'acceptance';
```

Then came the placeholder, this was a little trickier. As the placeholder
content could include spaces I needed to first find the index of 'placeholder'
then run through the array starting at the index after the placeholder and stop
when the next array item contained a quote:

```php
<?php

$placeholder_index = array_search('placeholder', $atts);
$placeholder = false;

if($placeholder_index !== false) {
    $tmp = [];

    // $placeholder_index is currently the location of
    // "placeholder" so we want to start from the next item
    $count = $placeholder_index + 1;

    while ($count < count($atts)) {
        $item = $atts[$count];
        $placeholder_end = strpos($item, '"') !== false && $count !== $placeholder_index + 1;
        $item = str_replace('"', '', $item);

        $tmp[] = $item;

        $count++;

        if($placeholder_end) {
            break;
        }
    }

    $placeholder = join($tmp, ' ');

}
```

After doing all this I could return the data that I wanted:

```php
<?php

return array('id' => $field_id, 'required' => $is_required, 'type' => $type, 'copy' => $placeholder)
```

The only thing to do now was to remove any unwanted items such as `submit` and
the closing tags such as `[/acceptance]`:

```php
<?php

$fields = array_filter($fields, function($field) {
    return $field['id'] !== $field['type'] || strpos($field['id'], '/') !== false;
});
```

Here is the full `get_cf7_field_data_from_shortcodes` function:

```php
<?php

function get_cf7_field_data_from_shortcodes($shortcodes) {
    $fields = array_map(function($shortcode){
        $atts = explode(' ', $shortcode);

        $larger_than_one = array_key_exists(1, $atts);
        // check for class and id ats as in [acceptance class:some-class]
        $has_class = $larger_than_one && strpos( $atts[1], 'class:') !== false;
        $has_id = $larger_than_one && strpos( $atts[1], 'id:') !== false;
        // the second array item is always the field id with cf7
        $field_id = $larger_than_one && !$has_class && !$has_id ? $atts[1] : $atts[0];

        $is_required = strpos($atts[0], '*') !== false || $atts[0] === 'acceptance';

        $type = str_replace('*', '', $atts[0]);
        $placeholder_index = array_search('placeholder', $atts);
        $placeholder = false;

        if($placeholder_index !== false) {
            $tmp = [];

            // $placeholder_index is currently the location of
            // "placeholder" so we want to start from the next item
            $count = $placeholder_index + 1;

            while ($count < count($atts)) {
                $item = $atts[$count];
                $placeholder_end = strpos($item, '"') !== false && $count !== $placeholder_index + 1;
                $item = str_replace('"', '', $item);

                $tmp[] = $item;

                $count++;

                if($placeholder_end) {
                    break;
                }
            }

            $placeholder = join($tmp, ' ');

        }

        return  array('id' => $field_id, 'required' => $is_required, 'type' => $type, 'copy' => $placeholder);
    }, $shortcodes);

    $fields = array_filter($fields, function($field) {
        return $field['id'] !== $field['type'] || strpos($field['id'], '/') !== false;
    });

    return $fields;
}
```

## Pass the field data to the frontend via `wp_localize_script`

We now have the form data and we just need to pass it to the front end, to do
this I set up an ACF field to allow the user to select the form they want to use
on the page. In addition to the field data I also sent the form messages and the
submitUrl :

```php

<?php

function add_front_scripts($hook) {

    $js_version  = date("ymd-Gis", filemtime( get_stylesheet_directory() . '/include/js/some.js' ));

	wp_register_script( 'some_js', get_stylesheet_directory_uri() . '/include/js/some.js', array(), $js_version, true );

    $form_id = get_field('contact_form');

    if(empty($form_id)) return;

    $contact_data = wpcf7_contact_form($form_id)->get_properties();
    $form = $contact_data['form'];
    $form_tags = just_shortcodes($form);
    $fields = get_cf7_field_data_from_shortcodes($form_tags);

    wp_localize_script( 'some_js', 'formData', array(
        'fields' => array_values($fields),
        'messages' => $contact_data['messages'],
        'submitUrl' => get_rest_url() . 'contact-form-7/v1/contact-forms/' . $form_id . '/feedback'
	) );

    wp_enqueue_script( 'some_js' );
}
add_action('wp_enqueue_scripts', 'add_front_scripts');
```

A possible improvement to the above (in addition to refactoring) would be to
register a custom endpoint that would respond with the data.
