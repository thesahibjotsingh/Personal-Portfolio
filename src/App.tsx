import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Work from './components/Work'
import About from './components/About'
import Stack from './components/Stack'
import Contact from './components/Contact'
import Footer from './components/Footer'
import SmoothScroll from './components/SmoothScroll'
import Cursor from './components/Cursor'

function App() {
  return (
    <>
      <SmoothScroll />
      <Cursor />
      <Navbar />
      <main>
        <Hero />
        <Work />
        <About />
        <Stack />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App
