import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// File size constants (2MB in bytes)
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export const uploadAudioToS3 = async (base64Audio, fileName) => {
  try {
    // Extract the base64 data (remove the data:audio/webm;base64, part)
    const base64Data = base64Audio.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');
    
    console.log('Audio buffer size:', buffer.length, 'bytes');
    
    if (buffer.length === 0) {
      throw new Error('Audio buffer is empty');
    }
    
    if (buffer.length > MAX_FILE_SIZE) {
      throw new Error(`Audio file too large: ${(buffer.length / (1024 * 1024)).toFixed(2)}MB. Maximum allowed: ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
    }
    
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `audio/${Date.now()}_${fileName}`,
      Body: buffer,
      ContentType: 'audio/webm',
      ACL: 'public-read',
      CacheControl: 'max-age=31536000',
      Metadata: {
        'original-name': fileName,
        'upload-time': new Date().toISOString(),
        'file-size': buffer.length.toString()
      }
    };
    
    const data = await s3.upload(params).promise();
    console.log('S3 audio upload successful:', data.Location);
    return data.Location;
  } catch (error) {
    console.error('S3 audio upload error:', error);
    throw new Error('Failed to upload audio to S3: ' + error.message);
  }
};

export const uploadImageToS3 = async (imageBuffer, fileName, contentType) => {
  try {
    console.log('Starting image upload to S3...');
    console.log('Image details:', {
      fileName,
      contentType,
      bufferSize: imageBuffer.length
    });
    
    if (imageBuffer.length === 0) {
      throw new Error('Image buffer is empty');
    }
    
    if (imageBuffer.length > MAX_FILE_SIZE) {
      throw new Error(`Image file too large: ${(imageBuffer.length / (1024 * 1024)).toFixed(2)}MB. Maximum allowed: ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
    }
    
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `images/${Date.now()}_${fileName}`,
      Body: imageBuffer,
      ContentType: contentType,
      ACL: 'public-read',
      CacheControl: 'max-age=31536000',
      Metadata: {
        'original-name': fileName,
        'upload-time': new Date().toISOString(),
        'file-size': imageBuffer.length.toString()
      }
    };
    
    console.log('Uploading image to S3 with params:', {
      Bucket: params.Bucket,
      Key: params.Key,
      ContentType: params.ContentType,
      BufferSize: imageBuffer.length
    });
    
    const data = await s3.upload(params).promise();
    console.log('S3 image upload successful:', data.Location);
    return data.Location;
  } catch (error) {
    console.error('S3 image upload error:', error);
    throw new Error('Failed to upload image to S3: ' + error.message);
  }
};

export const deleteFromS3 = async (fileUrl) => {
  try {
    if (!fileUrl.includes('amazonaws.com')) {
      throw new Error('Not an S3 URL');
    }
    
    const url = new URL(fileUrl);
    const key = url.pathname.substring(1); // Remove leading '/'
    
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key
    };
    
    await s3.deleteObject(params).promise();
    console.log('S3 file deleted successfully:', key);
  } catch (error) {
    console.error('S3 deletion error:', error);
    throw new Error('Failed to delete from S3: ' + error.message);
  }
};
      throw new Error('Not an S3 URL');
    }
    
    const url = new URL(fileUrl);
    const key = url.pathname.substring(1); // Remove leading '/'
    
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key
    };
    
    await s3.deleteObject(params).promise();
    console.log('S3 file deleted successfully:', key);
  } catch (error) {
    console.error('S3 deletion error:', error);
    throw new Error('Failed to delete from S3: ' + error.message);
  }
};
