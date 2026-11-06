import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Work from './components/Work'
import Services from './components/Services'
import About from './components/About'
import Stack from './components/Stack'
import Contact from './components/Contact'
import Footer from './components/Footer'
import SmoothScroll from './components/SmoothScroll'
import Cursor from './components/Cursor'
import ScrollProgress from './components/ScrollProgress'

function App() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <SmoothScroll />
      <Cursor />
      <ScrollProgress />
      <Navbar />
      <main id="main">
        <Hero />
        <Work />
        <Services />
        <About />
        <Stack />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App
