import React, { useState } from 'react';
import { Box,Button, TextField, Container, Grid, Card, CardContent, CardActions, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import Spinner from './Spinner';

const ImageBlog = () => {
  const [image, setImage] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [loading,setLoading] =useState(false);
  const [url, setUrl] = useState('');
  const [response,setResponse]=useState('');
  var prompt="Write a blog about the image. "
  return (
    <Container style={{marginTop:20}}>
    <Typography variant='h4'>Image to Blog Generator</Typography>
      <Card>
        <CardContent>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="contained-button-file"
                type="file"
                onChange={(e)=>{
                  const file = e.target.files[0];
                  if (file && file.type && file.type.startsWith('image/')) {
                  setImage(e.target.files[0])
                  const reader = new FileReader();
                  reader.onload = function (e) {
                    setUrl(URL.createObjectURL(file));
                  };
                  reader.readAsDataURL(file);
                } else {
                  console.error('The uploaded file is not an image.');
                }
                            }}
              />
              <label htmlFor="contained-button-file">
                <Button variant="contained" component="span">
                  Upload Image
                </Button>
              </label>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="text-input"
                label="Instructions for the Blog"
                variant="outlined"
                value={textInput}
                onChange={(e)=>{
                    setTextInput(e.target.value);
                }}
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions style={{ justifyContent: 'center' }}>
          <Button variant="contained" color="primary" 
          onClick={async ()=>{
            setLoading(true);
            try {
      const reader = new FileReader();

      reader.onload = async () => {
        const arrayBuffer = reader.result;

        const response = await fetch('https://gemini-image-to-blog-generator.vercel.app/image', {
          method: 'POST',
          body: arrayBuffer,
          headers: {
            'Content-Type': 'application/octet-stream',
            prompt:prompt + textInput,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setResponse(data.message);
          setLoading(false);
        } else {
          console.error('Error:', response.statusText);
        }
      };

      reader.readAsArrayBuffer(image);
    } catch (error) {
      console.error('Fetch Error:', error);
    }
  }
                   
       }>
           Generate Blog!
          </Button>
        </CardActions>
    {image && (
      <Box style={{display:"flex",justifyContent:"center"}}>
      <Box>
      <img
        id="visible-image"
        src={url}
        alt="Uploaded"
        style={{ maxWidth: '100%', maxHeight: '300px' }}
      />
      </Box>
      </Box>
    )}
    <Box style={{marginTop:"20px",display:"flex",justifyContent:"center"}}>
    {loading?(<Spinner />):(<Typography><ReactMarkdown>{response}</ReactMarkdown></Typography>)}
      </Box>
      </Card>
    </Container>
  );
};

export default ImageBlog;
