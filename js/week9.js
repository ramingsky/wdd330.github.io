//Quiz Ninja
//Chapter 10 Quiz Ninja
const url = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/123941/questions.json';
fetch(url)
.then(res => res.json())
.then(quiz => {
    view.start.addEventListener('click', () => game.start(quiz.questions), false);
    view.response.addEventListener('click', (event) => game.check(event), false);
});
   
  const view = {
    timer: document.querySelector('#timer strong'),
    score: document.querySelector('#score strong'),
    question: document.getElementById('question'),
    result: document.getElementById('result'),
    info: document.getElementById('info'),
    start: document.getElementById('start'),
    response: document.querySelector('#response'),
    hiScore: document.querySelector('#hiScore > strong'),
    render(target,content,attributes) {
      for(const key in attributes) {
        target.setAttribute(key,attributes[key]);
      }
      target.innerHTML = content;
    },
    show(element){
      element.style.display = 'block';
    },
    hide(element){
      element.style.display = 'none';
    },
    setup(){
        this.show(this.question);
        this.show(this.response);
        this.show(this.result);
        this.hide(this.start);
        this.render(this.score,game.score);
        this.render(this.result,'');
        this.render(this.info,'');
        this.render(this.hiScore, game.hiScore());
    },
    buttons(array){
      return array.map(value => `<button>${value}</button>`).join('');
    },
    teardown(){
        this.hide(this.question);
        this.hide(this.response);
        this.show(this.start);
        this.render(this.hiScore, game.hiScore());
    }
  }
  
  function random(a,b=1) {
    //if only one argument is provided, we need to swap the values of a and b
    if(b === 1) {
      [a,b] = [b,a];
    }
    return Math.floor((b-a+1) * Math.random()) + a;
  }
  
  function shuffle(array){
    for (let i = array.length; i; i--) {
      let j = random(i) - 1;
      [array[i - 1], array[j]] = [array[j], array[i - 1]];
    }
  }
  
  const game = {
    start(quiz){
        console.log('start() invoked');
        this.score = 0;
        this.questions = [...quiz];
        view.setup();
        this.ask();
        this.secondsRemaining = 20;
        this.timer = setInterval(this.countdown, 1000);
    },
    ask(name){
      console.log('ask() invoked');
      if(this.questions.length > 2){
        shuffle(this.questions);
        this.question = this.questions.pop();
        const options = [this.questions[0].realName, this.questions[1].realName, this.question.realName];
        shuffle(options);
        const question = `What is ${this.question.name}'s real name?`;
        view.render(view.question,question);
        view.render(view.response,view.buttons(options));
      } else {
        this.gameOver();
      }
    },
    check(event){
      console.log('check(event) invoked');
      const response = event.target.textContent;
      const answer = this.question.realName;
  
      if(response === answer) {
        view.render(view.result, 'Correct!', {'class':'correct'});
        this.score++;
        view.render(view.score,this.score);
      } else {
        view.render(view.result,`Wrong! The correct answer was ${answer}`,{'class':'wrong'});
      }
      this.ask();
    },
    countdown(){
        game.secondsRemaining--;
        view.render(view.timer,game.secondsRemaining);
        if(game.secondsRemaining <= 0){
            game.gameOver();
        }
    },
    gameOver(){
      console.log('gameOver() invoked');
      view.render(view.info,`Game Over, you scored ${this.score} point${this.score !== 1 ? 's' : ''}!`);
      view.teardown();
      clearInterval(this.timer);
    },
    hiScore(){
      const hi = localStorage.getItem('highScore') || 0;
      if(this.score > hi || hi === 0) {
        localStorage.setItem('highScore',this.score);
        view.render(view.info,'** NEW HIGH SCORE! **');
      }
      return localStorage.getItem('highScore');
    }
  }
  
  //view.response.addEventListener('click', (event) => game.check(event), false);
  //view.start.addEventListener('click', () => game.start(quiz), false);