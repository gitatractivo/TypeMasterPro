import useKeyDown from "./hooks/useKeyDown"
import useWords from "./hooks/useWord"


function App() {

  const {words,handleKeyPress}=useWords()
  useKeyDown((key,code)=>{
    handleKeyPress(key,code)

  })


  return (
    <>
      
    </>
  )
}

export default App
