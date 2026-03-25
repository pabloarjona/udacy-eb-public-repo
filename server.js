import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util.js';

console.log("Starting server...");


  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8080;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

    /**************************************************************************** */

  //! END @TODO1
  console.log("Server running...2");
  // Root Endpoint
  // Displays a simple message to the user
  app.get("/health", (req, res) => res.send("OK"));
  app.get( "/", (req, res) => {
    const port = process.env.PORT || 8080;
    console.log(`Server running on port ${port}`);
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  
  app.get('/filteredimage', async (req, res) => {
    const { image_url: imageUrl } = req.query;

    if (!imageUrl) {
      return res.status(400).send({ message: 'image_url query parameter is required' });
    }

    try {
      new URL(imageUrl); // validate URL format
    } catch (err) {
      return res.status(400).send({ message: 'image_url must be a valid URL' });
    }

    let filteredImagePath;

    try {
      filteredImagePath = await filterImageFromURL(imageUrl);
    } catch (error) {
      console.error('Error filtering image:', error);
      return res.status(422).send({ message: 'Unable to process the image from the provided URL' });
    }

    res.on('finish', async () => {
      if (filteredImagePath) {
        try {
          await deleteLocalFiles([filteredImagePath]);
        } catch (err) {
          console.error('Error deleting local file:', err);
        }
      }
    });

    return res.status(200).sendFile(filteredImagePath);
  });

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
