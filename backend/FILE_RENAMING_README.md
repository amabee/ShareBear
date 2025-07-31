# File Renaming Feature

This feature allows you to automatically rename uploaded files using different strategies for better organization, security, and deduplication.

## Available Strategies

### 1. UUID Strategy (Default)
- **Strategy**: `uuid`
- **Format**: `550e8400-e29b-41d4-a716-446655440000.jpg`
- **Best for**: Security and uniqueness
- **Pros**: Completely random, no information leakage, guaranteed uniqueness
- **Cons**: No human-readable information

### 2. Timestamp Strategy
- **Strategy**: `timestamp`
- **Format**: `1703123456789_a1b2c3d4.jpg`
- **Best for**: Chronological organization
- **Pros**: Time-based sorting, still unique, readable timestamps
- **Cons**: Slightly predictable

### 3. Hash Strategy
- **Strategy**: `hash`
- **Format**: `a1b2c3d4e5f6g7h8.jpg`
- **Best for**: Deduplication and content-based naming
- **Pros**: Same content = same filename, prevents duplicates
- **Cons**: Requires computing hash for each file

### 4. User-Specific Strategy
- **Strategy**: `user_specific`
- **Format**: `user_123_1703123456789_a1b2.jpg`
- **Best for**: User organization and debugging
- **Pros**: Easy to identify user files, good for debugging
- **Cons**: Includes user information in filename

### 5. Original Strategy
- **Strategy**: `original`
- **Format**: `my_awesome_photo.jpg` (sanitized)
- **Best for**: Keeping original names
- **Pros**: Preserves original naming
- **Cons**: Potential conflicts, less secure

## Configuration

### Environment Variable
Set the `FILE_RENAME_STRATEGY` environment variable in your `.env` file:

```env
# Choose one of: uuid, timestamp, hash, user_specific, original
FILE_RENAME_STRATEGY=uuid
```

### Default Configuration
If no strategy is specified, the system defaults to `uuid` strategy.

## Usage

The file renaming is automatically applied when uploading files through the posts API. The system will:

1. Generate a new filename based on the selected strategy
2. Preserve the original file extension
3. Log the original and new filenames for debugging
4. Return the new file path

## Example Output

```
File upload: my-awesome-photo.jpg -> 550e8400-e29b-41d4-a716-446655440000.jpg (1.00MB)
```

## Testing

Run the test script to see examples of all strategies:

```bash
node test-file-renaming.js
```

## Security Considerations

- **UUID/Timestamp/Hash**: No information leakage in filenames
- **User-Specific**: Includes user ID in filename (consider privacy implications)
- **Original**: May leak information about the original file

## Performance Considerations

- **UUID/Timestamp**: Fastest generation
- **Hash**: Requires computing SHA-256 hash (slight performance impact)
- **User-Specific**: Fast generation with user context
- **Original**: Fastest (just sanitization)

## Recommendations

- **Production**: Use `uuid` for maximum security
- **Development**: Use `user_specific` for easier debugging
- **Deduplication**: Use `hash` if you want to prevent duplicate uploads
- **Organization**: Use `timestamp` for chronological sorting 
