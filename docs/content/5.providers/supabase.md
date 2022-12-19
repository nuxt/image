# Supabase

Optimize images with Supabase's storage transformation service

Supabase offers storage image transformation for all JPEG, PNG, and GIF files you have set to be tracked with [Supabase Storage](https://supabase.com/docs/guides/storage/image-transformations/).


## Modifiers

In addition to `height` and `width`, the Supabase provider supports the following modifiers:

### `fit`

* **Default**: `cover`
* **Valid options**: `cover` (equivalent to `resize=cover`), `contain` (equivalent to `resize=contain`) and `fill` (equivalent to `resize=fill`)


## Limits

- Width and height must be an integer value between 1-2500.
- The image size cannot exceed 25MB.
- The image resolution cannot exceed 50MP.