import 'bootstrap/dist/css/bootstrap.css'

// next.js takes our pages as per request and take them through a _app.js file. Here we are specifying our custom _app.js file. So for eg, index.js will be put inside this Component and next will return the rendered html with css accordingly.

export default ({ Component, pageProps }) => {
    return <Component {...pageProps} />
}