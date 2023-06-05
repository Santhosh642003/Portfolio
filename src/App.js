import { useEffect, useState } from 'react';
import './App.css';


function App() {

  const [blobPosition, setBlobPosition] = useState({ x: 0, y: 0 });

  function handleMouseMove(event) {
    setBlobPosition({ x: event.clientX, y: event.clientY });
  }

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  function scrollToAboutSection() {
    const aboutSection = document.getElementById("about-section");
    aboutSection.scrollIntoView({ behavior: "smooth" });
  }
  function scrollToSkillSection() {
    const skillSection = document.getElementById("skill-section");
    skillSection.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    const moveBlob = event => {
      const blob = document.getElementById('blob');
      blob.animate({
        left : `${event.clientX}px`,
        top : `${event.clientY}px`
      }, {duration: 3000, fill: "forwards"});
    };

    document.addEventListener('mousemove', moveBlob);

    return () => {
      document.removeEventListener('mousemove', moveBlob);
    };
  }, []);

  useEffect(() => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let interval = null;

    const nameElement = document.querySelector(".Name");

    nameElement.onmouseover = () => {
      let iteration = 0;
      
      clearInterval(interval);
      
      interval = setInterval(() => {
        nameElement.innerText = nameElement.innerText
          .split("")
          .map((letter, index) => {
            if(index < iteration) {
              return nameElement.dataset.value[index];
            }
          
            return letters[Math.floor(Math.random() * 26)]
          })
          .join("");
        
        if(iteration >= nameElement.dataset.value.length){ 
          clearInterval(interval);
        }
        
        iteration += 1 / 3;
      }, 30);
    };
  }, []);
  

  
  return (
    <>
    <div id='blob' className='blob' style={{ top: blobPosition.y, left: blobPosition.x }}></div>
    <div className='main'>
    <div className='Navbar'>
    <p onClick={scrollToAboutSection} className='title'>About</p>
    <p onClick={scrollToSkillSection} className='title'>Skills</p>
    <p className='title'>Contact</p>
    </div>
    <div className='intro'>
    <div className='Greetings'>Hello</div>
    <div className='Name' data-value="I'M SANTHOSH NAIK">I'M SANTHOSH NAIK</div>
    <div className='bio'>Full stack Developer</div>
    </div>
    <div id="about-section" className='about'>
    <p className='about-head'>About Me</p>
        <div className='about-info'>I am a dedicated Full Stack Developer, currently pursuing my undergraduate degree in Computer Science. With a strong focus on the MERN (MongoDB, Express.js, React, Node.js) stack, I have gained valuable experience through various projects during my college years.</div>
        <div className='about-info1'>One of my notable achievements includes building a Social Media platform, where I leveraged my skills in front-end and back-end development to create an engaging and user-friendly experience. This project allowed me to apply my knowledge of database management, API integration, and responsive web design</div>
        <div className='about-info2'>In addition to my technical expertise, I have a passion for storytelling. During my free time, I indulge in creative writing and have written a considerable number of captivating stories. This creative outlet not only helps me sharpen my communication skills but also allows me to think outside the box and bring unique perspectives to my development work.</div>
        <div className='about-info3'>I am constantly seeking new challenges and opportunities to expand my knowledge and skills in the ever-evolving field of software development. With a solid foundation in both front-end and back-end technologies, coupled with my enthusiasm for problem-solving, I am confident in my ability to contribute effectively to any project or team</div>
        </div>
        <div id="skill-section" className='skills'>
        <p className='skill-head'>Skills</p>
        <div className='skill-list'>
      <div className='skill'>
      <p className='skillName'>HTML</p>
      </div>
      <div className='skill'>
      <p className='skillName'>CSS</p>
      </div>
      <div className='skill'>
      <p className='skillName'>React</p>
      </div>
      <div className='skill'>
      <p className='skillName'>Figma</p>
      </div>
      <div className='skill'>
      <p className='skillName'>Node JS</p>
      </div>
      <div className='skill'>
      <p className='skillName'>MongoDB</p>
      </div>
      <div className='skill'>
      <p className='skillName'>Express</p>
      </div>
      </div>
      </div>
      </div>
      </>
      );
    }
    
    export default App;
