if (typeof GgMarquee === 'undefined') {
  class GgMarquee {
        constructor(el, config){
	    this.el = el;
		this.config = config;
       }
	buildMarquee() {
	    this.marquee = {
              m1: {
                pos: 0,
                inMotion: true,
                html: document.createElement('div')
              },
              m2: {
                pos: window.innerWidth,
                inMotion: false,
                html: null
              },
              clones: 0,
              items: this.el.querySelectorAll(':scope > * '),
              width: 0,
			  speed: parseInt(this.config.speed)* 3/4
            }
            // this.appendChild(marqueeEl);
            this.marquee.width = this.getMarqueeWidth(this.marquee.items) 
            for (let n of [...this.marquee.items]) {
                n.classList.add('gg-inner-child');
                this.marquee.m1.html.appendChild(n);
            }
            this.setWidth()
            this.marquee.m1.html.classList.add('gg-inner');
            this.marquee.m2.html = this.marquee.m1.html.cloneNode(true)
            this.marquee.m2.html.classList.add('gg-alternate-inner')
            for (let m of [this.marquee.m1, this.marquee.m2]) this.el.appendChild(m.html);
            for (const m of this.getMarquees()) this.setMarqueePos(m);            
            this.startMarquee();
            const resize = debounce(this.calculateResize.bind(this), 250)
            window.addEventListener('resize', () => {
                const ctx = this;
                resize.bind(ctx)
                resize()
            })
			this.el.classList.add('gg-marquee-initialized');
	}
        calculateResize() {
            // console.log('calculateResize', [this])
            this.getMarqueeWidth(this.marquee.m1.html.children)
            this.setWidth();
            for (const m of [this.marquee.m1, this.marquee.m2]) {
                if (!m.inMotion) m.pos = window.innerWidth
                this.setMarqueePos(m)
            }
        }
        setWidth() {
          while (this.marquee.width < window.innerWidth*2)
            {
              this.doubleMarqueeSize()
            }
            this.marquee.m1.html.style.width = `${this.marquee.width}px`;
            if (this.marquee.m2.html) this.marquee.m2.html.style.width = `${this.marquee.width}px`;
        }
        doubleMarqueeSize() {
          this.marquee.clones++;
          const initSize = this.marquee.clones * this.marquee.m1.html.children.length
          for (let i = 0; i < initSize; i++) {
            this.marquee.m1.html.appendChild(this.marquee.m1.html.children[i].cloneNode(true))
            if (this.marquee.m2.html) this.marquee.m2.html.appendChild(this.marquee.m2.html.children[i].cloneNode(true));
          }
          this.marquee.width*=2;
        }
        getMarquees() {
          return [this.marquee.m1, this.marquee.m2];
        }
        getMarqueeWidth(items) {
          return [...items].reduce((accumlator, curr) => accumlator + curr.clientWidth, 0);
        }
        setMarqueePos(marquee, translatePos = 0) {
            marquee.pos += translatePos;
            marquee.html.style.transform = `translateX(${marquee.pos}px)`;
        }
        
        setMarqueeInMotion() {
          for (let i = 0; i < 2; i++) {
            let m, mPrime;
            if (i === 0) {
               m = this.marquee.m1;
               mPrime = this.marquee.m2;
            } else {
              m = this.marquee.m2;
              mPrime = this.marquee.m1;
            }
            const overflowSize = this.marquee.width - window.innerWidth;
            if (m.inMotion) {
              if (m.pos < this.marquee.width * -1) { // marquee is out of sight
                m.inMotion = false;
                m.pos = window.innerWidth;
              }
              
               if(overflowSize + m.pos < 5){ // The edge of the marquee has entered the window
                if (!mPrime.inMotion) mPrime.inMotion = true;
              }
            }
          }
        }

        shiftMarquee() {
          this.setMarqueeInMotion();
          for (const m of this.getMarquees()) {
            let trans = 0;
            if (m.inMotion) trans = this.marquee.speed * -1;
            this.setMarqueePos(m, trans);
          }
          requestAnimationFrame(() => this.shiftMarquee())
        }
        startMarquee() {
          console.log('start Marquee')
          requestAnimationFrame(() =>this.shiftMarquee())
        }

    }
window.requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (f) {
    return setTimeout(f, 1000 / 60);
    }; // simulate calling code 60

window.cancelAnimationFrame =
    window.cancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    function (requestID) {
    clearTimeout(requestID);
    }; //fall back

// David Walsh's Debouncing function
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};
// if (!Shopify.designMode) {
    // This will only render in the theme editor
//    const marquees = document.querySelectorAll('.gg-marquee')
//    for (let i = 0; i < marquees.length; i++) {
//          const ggMarquee = new GgMarquee(marquees[i]);
//          const imgs = marquees[i].querySelectorAll('img')
//          const imgUrls = [...imgs].map(i => i.src)
//          if (imgs) { 
//      	loadImages(imgUrls).then(() => {
//      	    
//      		ggMarquee.buildMarquee();
//          })
//          } else {
//      	    ggMarquee.buildMarquee();
//          }
// 
//     }
// }

 window.GgMarquee = GgMarquee;
}
