import React from 'react';
import {createRoot} from 'react-dom/client';
import DebugMission from './src/components/DebugMission';
import JourneyView from './src/components/JourneyView';
import {setLocale,setActiveLanguage} from './src/data';
setLocale(new URLSearchParams(location.search).get('locale')||'en');
setActiveLanguage(new URLSearchParams(location.search).get('language')||'python');
createRoot(document.getElementById('root')).render(new URLSearchParams(location.search).has('journey')?<JourneyView/>:<DebugMission language={new URLSearchParams(location.search).get('language')||'python'} onClose={()=>{window.__closed=true}}/>);
