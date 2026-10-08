import React from 'react'
import { createRoot } from 'react-dom/client'
import LessonScreen from '../src/components/LessonScreen.jsx'
import { getExercisesForNode } from '../src/data/core.js'
import { pyExercisesCh6to10 } from '../src/exercises_python2.js'
import { jsExercisesCh6to10 } from '../src/exercises_js2.js'
import { javaExercises } from '../src/exercises_java.js'
import { javaExercisesCh6to10 } from '../src/exercises_java2.js'
const entries=[]
for (const [lang,bank] of [['python',pyExercisesCh6to10],['javascript',jsExercisesCh6to10],['java',javaExercises],['java',javaExercisesCh6to10]]) {
 for(const [node,list] of Object.entries(bank)) list.forEach((ex,i)=>{if(ex.type==='complexity' && ex.optionA)entries.push(getExercisesForNode(Number(node),lang)[i])})
}
window.cards=entries
const root=createRoot(document.getElementById('root'))
window.mountCard=i=>root.render(<LessonScreen key={i} practice exercises={[entries[i]]} onClose={()=>{}} />)
