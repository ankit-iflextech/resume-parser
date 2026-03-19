// om namho bhagwate vashudevay namah

import express from 'express';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import staticRoutes from './src/routes/static/index.route.js';
import apiRoutes from './src/routes/api/index.route.js';

const app = express();

const port = process.env.PORT || 3000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine','ejs');
app.set('views',path.resolve('./src/views'));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This one line serves everything inside /public
app.use(express.static(path.join(__dirname, 'src/public')));



app.use('/', staticRoutes);
app.use('/api', apiRoutes)


app.get('/test',(req,res)=>{
    res.status(200).json({
        message:"This is the test url and working fine"
    });
})

app.listen(port,()=>{
    console.log(`Server is successfully run on ${port}`)
})