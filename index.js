const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const multer = require('multer')
const cheerio = require('cheerio');
const sanitizeHtml = require('sanitize-html');
const fs = require('fs')
const app = express()
const port = 5000

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}))

// mongoose.connect('mongodb+srv://youssefmohammed2342:xebnWBjezofCCZrZ@wesam-algazera.z1c7t0p.mongodb.net/?retryWrites=true&w=majority', {
mongoose.connect('mongodb+srv://admin:mada203040@wesam-algazera.z1c7t0p.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
    console.log('connected')
}).catch((err) => {
    console.log('error: ' + err)
})

// Set up the storage configuration for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/'); // Specify the directory to store the uploaded files
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});
const upload = multer({ storage });

const Schema = mongoose.Schema;

const Project = new Schema({
    title: String,
    description: String,
    image: String,
    projectDesc: String,
    Features: String,
    projectFeatures: String,
    financialIndicators: String,
    studyContent: String,
    Country: String,
    createdAt: { type: Date, default: Date.now }
})

const Message = new Schema({
  firstName: String,
  lastName: String,
  Email: String,
  Subject: String,
  Message: String
})

const New = new Schema({
  Date: { type: Date, default: Date.now },
  Title: String,
  newDesc: String,
})

const projectModel = mongoose.model('project', Project);
const messageModel = mongoose.model('message', Message);
const newModel = mongoose.model('new', New)

app.get('/', async (req, res) => {
  try {
    const projects = await projectModel.find()
      .sort({ createdAt: -1 })
      .limit(3);

    const news = await newModel.find()
      .sort({ Date: -1 })
      .limit(3);

    res.render('index', { projects, news });
  } catch (err) {
    console.error(err);
    // Handle the error appropriately
  }
});

app.get('/about-us', (req, res) => {
    res.render('about')
})

app.get('/clients', (req, res) => {
    res.render('clients')
})

app.get('/feasibility-studies', (req, res) => {
  projectModel.find()
    .then((projects) => {
      res.render('all-projects', { projects });
    })
    .catch((err) => {
      console.log('Error fetching projects from MongoDB: ' + err);
      res.render('all-projects', { projects: [] });
    });
});

app.get('/project/:id', (req, res) => {
  const projectId = req.params.id;

  projectModel.findById(projectId)
    .then((project) => {
      if (!project) {
        // If project with the given ID is not found
        return res.status(404).send('Project not found');
      }

      res.render('one-project', { project });
    })
    .catch((err) => {
      console.log('Error retrieving project details: ' + err);
      res.status(500).send('Internal Server Error');
    });
});

app.post('/projectUpdate', (req, res) => {
  console.log(req.body.projectTitle)
  projectModel.findOne({title: req.body.projectTitle})
  .then((result) => {
    console.log(result)
    res.render('admin/updateform', {project : result})
  })
  .catch((err) => {
    console.error(err)
  })
})

app.post('/update', upload.single('image'), (req, res) => {
  console.log(req.body.projectTitle)
  var imageBuffer = null;
  if(req.file){
    const data = fs.readFileSync(req.file.path);
    imageBuffer = Buffer.from(data);
  }
  const sanitizedDesc = sanitizeHtml(req.body.desc);
  const sanitizedProjectDesc = sanitizeHtml(req.body.projectDesc);
  const sanitizedFeat = sanitizeHtml(req.body.feat);
  const sanitizedProjectFeat = sanitizeHtml(req.body.projectFeat);
  const sanitizedFinaIndic = sanitizeHtml(req.body.finaIndic);
  const sanitizedStudy = sanitizeHtml(req.body.study);
  const sanitizedCountry = sanitizeHtml(req.body.country);

  projectModel.findOne({ title: req.body.projectTitle })
  .then((project) => {
    if (project) {
      // ...

      if (req.file) {
        const data = fs.readFileSync(req.file.path);
        imageBuffer = Buffer.from(data);
        project.image = imageBuffer.toString('base64');
      }

      project.title = req.body.title;
      project.description = sanitizedDesc !== "" ? sanitizedDesc : null;
      project.projectDesc = sanitizedProjectDesc !== "" ? sanitizedProjectDesc : null;
      project.Features = sanitizedFeat !== "" ? sanitizedFeat : null;
      project.sanitizedProjectFeat = sanitizedProjectFeat !== "" ? sanitizedProjectFeat : null;
      project.sanitizedFinaIndic = sanitizedFinaIndic !== "" ? sanitizedFinaIndic : null;
      project.sanitizedStudy = sanitizedStudy !== "" ? sanitizedStudy : null;
      project.sanitizedCountry = sanitizedCountry !== "" ? sanitizedCountry : null;

      return project.save();
    } else {
      console.log('Project not found');
      res.send('Project not found');
    }
  })
  .then((updatedProject) => {
    if (updatedProject) {
      console.log('Project updated:', updatedProject);
      // res.send('Project updated successfully');
      res.redirect('/feasibility-studies')
    }
  })
  .catch((error) => {
    console.error('Error updating project:', error);
    res.status(500).send('Error updating project');
  });
});

app.post('/create', upload.single('image'), (req, res) => {
  
  const data = fs.readFileSync(req.file.path);
  const imageBuffer = Buffer.from(data);

  const sanitizedDesc = sanitizeHtml(req.body.desc);
  const sanitizedProjectDesc = sanitizeHtml(req.body.projectDesc);
  const sanitizedFeat = sanitizeHtml(req.body.feat);
  const sanitizedProjectFeat = sanitizeHtml(req.body.projectFeat);
  const sanitizedFinaIndic = sanitizeHtml(req.body.finaIndic);
  const sanitizedStudy = sanitizeHtml(req.body.study);
  const sanitizedCountry = sanitizeHtml(req.body.country);

  const project = new projectModel({
    title: req.body.title,
    description: sanitizedDesc,
    image: imageBuffer.toString('base64'),
    projectDesc: sanitizedProjectDesc,
    Features: sanitizedFeat,
    projectFeatures: sanitizedProjectFeat,
    financialIndicators: sanitizedFinaIndic,
    studyContent: sanitizedStudy,
    Country: sanitizedCountry,
  });

  project.save()
    .then(() => {
      console.log('Project saved successfully.');
      res.redirect('/feasibility-studies');
    })
    .catch((err) => {
      console.log('Error saving project: ' + err);
      res.redirect('/feasibility-studies');
    });
});

app.post('/delete', (req, res) => {
  const projectTitle = req.body.projectTitle;
  console.log(projectTitle);

  projectModel.findOneAndDelete({ title: projectTitle })
  .then((deletedProject) => {
    if (deletedProject) {
      // console.log('Project deleted:', deletedProject);
      res.redirect('/feasibility-studies');
      // res.send('Project deleted successfully');
    } else {
      console.log('Project not found');
      res.send('Project not found');
    }
  })
  .catch((error) => {
    console.error('Error deleting project:', error);
    res.status(500).send('Error deleting project');
  });
});

app.get('/admin/create', (req, res) => {
  res.render('admin/createprojects')
})
app.get('/admin/delete', (req, res) => {
  projectModel.find()
  .then((projects) => {
    res.render('admin/deleteprojects', { projects });
  })
  .catch((err) => {
    console.log('Error fetching projects from MongoDB: ' + err);
    res.render('admin/deleteprojects', { projects: [] });
  });
  // res.render('admin/deleteprojects')
})
app.get('/admin/update', (req, res) => {
  projectModel.find()
  .then((projects) => {
    res.render('admin/updateprojects', { projects });
  })
  .catch((err) => {
    console.log('Error fetching projects from MongoDB: ' + err);
    res.render('admin/updateprojects', { projects: [] });
  });
})

app.get('/engineering-consultancy', (req, res) => {
    res.render('engineering-consultancy')
})

app.get('/marketing-consultancy', (req, res) => {
    res.render('marketing-consultancy')
})

app.get('/tenders', (req, res) => {
    res.render('tenders')
})

app.get('/contact', (req, res) => {
    res.render('contact')
})

app.get('/admin/messages', (req, res) => {
  messageModel.find()
  .then((result) => {
    res.render('admin/messages', {messages : result})
  })
  .catch((err) => {
    console.error(err)
  })
})

app.post('/send', (req, res) => {
  const message = new messageModel({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    Email: req.body.email,
    Subject: req.body.subject,
    Message: req.body.message,
  })
  message.save()
  .then(() => {
    console.log('message saved')
    res.redirect('/contact')
  })
  .catch((err) => {
    console.error(err)
  })
})

app.listen(port, () => {
    console.log('server is running in port 3000');
})