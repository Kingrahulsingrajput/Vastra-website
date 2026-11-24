import { useState, useEffect, useRef } from 'react';
import { tiltProps, Reveal, SmartImg } from '../hooks.jsx';
import Logo from './Logo.jsx';
import { slug } from '../data';

const Img = ({ src, alt }) => <SmartImg className="bgimg" src={src} alt={alt} />;
const SWATCHES = [['Banarasi', '#C9A24D', '#7A5A14'], ['Chanderi', '#0F4A33', '#1B7A55'], ['Ikat', '#5E1A35', '#B03A67'], ['Kanjivaram', '#8A2A1F', '#D9822B'], ['Pochampally', '#23306B', '#5B6FD6'], ['Paithani', '#6B2C84', '#E0B84F']];


const SLIDES = [
  {
    image: '/images/hero1.png',
    alt: 'Vastra luxury fashion collection',
    title: 'Embrace the unexpected',
    text: 'Where heritage is re-imagined.',
    cta: 'Discover the collection',
    go: ['all', 'all']
  },
  {
    image: '/images/hero2.png',
    alt: 'Vastra royal wedding collection',
    title: 'The Wedding Edit',
    text: 'Sherwanis and lehengas for your big day.',
    cta: 'Shop wedding wear',
    go: ['all', 'wedding']
  },
  {
    image: '/images/hero3.png',
    alt: 'Vastra premium workwear collection',
    title: 'Power, tailored',
    text: 'Workwear with a handloom soul.',
    cta: 'Shop office wear',
    go: ['all', 'office']
  },
  {
    image: '/images/hero4.png',
    alt: 'Vastra everyday ethnic collection',
    title: 'Everyday heritage',
    text: 'Kurtas and anarkalis, woven to last.',
    cta: 'Shop ethnic wear',
    go: ['all', 'ethnic']
  }
];



export function Hero({ onFilter }) {
  const [i, setI] = useState(0);
  const touchX = useRef(0);
  const ref = useRef(null);

  // Adjust hero height to fit the screen below navbar
  useEffect(() => {
    const fit = () => {
      const h = ['.announce', '.vastra-nav'].reduce(
        (total, selector) =>
          total +
          (document.querySelector(selector)?.offsetHeight || 0),
        0
      );

      ref.current?.style.setProperty(
        '--hero-h',
        `${Math.max(
          window.innerHeight - h,
          window.innerWidth < 768 ? 520 : 440
        )}px`
      );
    };

    fit();
    const timer = setTimeout(fit, 500);

    window.addEventListener('resize', fit);
    window.addEventListener('load', fit);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', fit);
      window.removeEventListener('load', fit);
    };
  }, []);

  const n = SLIDES.length;

  const go = (k) => {
    setI((k + n) % n);
  };

  // Automatically change image every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setI((current) => (current + 1) % n);
    }, 5000);

    return () => clearInterval(timer);
  }, [n]);

  const currentSlide = SLIDES[i];

  const onKey = (e) => {
    if (e.key === 'ArrowLeft') go(i - 1);
    if (e.key === 'ArrowRight') go(i + 1);
  };

  return (
    <header
      id="home"
      className="hero"
      ref={ref}
      tabIndex={-1}
      onKeyDown={onKey}
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        const distance =
          e.changedTouches[0].clientX - touchX.current;

        if (Math.abs(distance) > 50) {
          go(i + (distance < 0 ? 1 : -1));
        }
      }}
      aria-roledescription="carousel"
      aria-label="Vastra featured collections"
    >

      {/* Floating gold particles */}
      {Array.from({ length: 14 }, (_, k) => (
        <i
          key={k}
          className="mote"
          style={{
            left: `${(k * 37) % 100}%`,
            animationDelay: `${k * -1.3}s`,
            animationDuration: `${9 + (k % 5) * 2}s`
          }}
        />
      ))}

      {/* Full-width image slides */}
      {SLIDES.map((slide, index) => (
        <div
          key={slide.image}
          className={`hero-slide ${index === i ? 'active' : ''
            }`}
          aria-hidden={index !== i}
          aria-label={`Slide ${index + 1} of ${n}`}
        >
          <img
            src={slide.image}
            alt={slide.alt}
            className="hero-full-image"
          />
        </div>
      ))}

      {/* Dark overlay for readable text */}
      <div className="hero-full-overlay"></div>

      {/* Brand name */}
      <div className="hero-brand">
        <span>Vastra</span>
        <h2>The Atelier</h2>
        <p>Curating modern royalty</p>
      </div>

      {/* Promotional text */}
      <div className="hero-copy" key={i}>
        <span className="hero-eyebrow">
          VASTRA • THE ATELIER
        </span>

        <h1>{currentSlide.title}</h1>

        <p>{currentSlide.text}</p>

        <button
          type="button"
          className="btn btn-gold btn-lg"
          onClick={() => onFilter(...currentSlide.go)}
        >
          {currentSlide.cta}
        </button>
      </div>

      {/* Previous button */}
      <button
        type="button"
        className="hero-arrow prev"
        onClick={() => go(i - 1)}
        aria-label="Previous slide"
      >
        <i className="bi bi-chevron-left"></i>
      </button>

      {/* Next button */}
      <button
        type="button"
        className="hero-arrow next"
        onClick={() => go(i + 1)}
        aria-label="Next slide"
      >
        <i className="bi bi-chevron-right"></i>
      </button>

      {/* Slide indicators */}
      <div className="hero-dots">
        {SLIDES.map((slide, index) => (
          <button
            key={slide.image}
            type="button"
            className={index === i ? 'on' : ''}
            onClick={() => go(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === i ? 'true' : undefined}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="hero-counter">
        0{i + 1} / 0{n}
      </div>

    </header>
  );
}

// Drop your own photos into  src/assets/story/  (jpg, png, webp). They are picked up automatically
// and shown as a slideshow behind the rotating fabric cards. Files are shown in name order (1.jpg, 2.jpg ...).
const STORY_IMGS = Object.entries(import.meta.glob('../assets/story/*.{jpg,jpeg,png,webp,avif}', { eager: true, query: '?url', import: 'default' }))
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true })).map(([, u]) => u);

function StoryGallery() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (STORY_IMGS.length < 2) return;
    const t = setInterval(() => setI(x => (x + 1) % STORY_IMGS.length), 4500);
    return () => clearInterval(t);
  }, []);
  if (!STORY_IMGS.length) return import.meta.env.DEV ? <p className="story-hint"> </p> : null;
  return (
    <div className="story-gallery" aria-hidden="true">
      {STORY_IMGS.map((u, k) => <img key={u} src={u} alt="" className={k === i ? 'on' : ''} />)}
    </div>);
}


export const Story = () => (
  <section id="story" className="story">
    <div className="container-xl">
      <div className="row g-0 align-items-stretch">

        <div className="col-lg-5 story-art">
          <StoryGallery />

          <h2>Our Story</h2>

          <div className="ring-scene" aria-hidden="true">
            <div className="ring">
              {SWATCHES.map(([n, a, b], i) => (
                <div
                  key={n}
                  className="swatch"
                  style={{
                    '--i': i,
                    background: `repeating-linear-gradient(135deg, ${a} 0 10px, ${b} 10px 20px)`
                  }}
                >
                  <img
                    className="swatch-img"
                    src={`/images/swatches/${slug(n)}.png`}
                    alt={n}
                    onError={(e) => {
                      console.error("Image not found:", e.currentTarget.src);
                    }}
                  />
                  <span>{n}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Reveal className="col-lg-7 story-text">
          <p className="lead-serif">
            Vastra began with a simple belief: handloom deserves a modern wardrobe.
          </p>

          <p>
            We work directly with weaving clusters across India, so every saree,
            sherwani and kurta carries the name of the family who made it and
            pays them fairly. Heritage techniques, cut for the way you live now.
          </p>

          <div className="row text-center mt-4 g-3">
            {[
              ['120+', 'Artisan families'],
              ['14', 'Weaving regions'],
              ['100%', 'Handcrafted']
            ].map(([b, s]) => (
              <div key={s} className="col-4 stat">
                <b>{b}</b>
                <span>{s}</span>
              </div>
            ))}
          </div>
        </Reveal>

      </div>
    </div>
  </section>
);

const PROMOS = [['p-green', 'Golden Hour Gala', 'Evening silks in gold and emerald.', 'Shop evening'], ['p-wine', 'Wedding Edit', 'Lehengas and sherwanis, ready to ship.', 'Shop weddings'], ['p-gold', "Members' Atelier", 'Extra 30% off for members.', 'Join now']];
export function Offers({ onJoin }) {
  const [flip, setFlip] = useState(null);
  return (
    <section id="offers" className="container-xl section">
      <Reveal><h2 className="sec-title mb-4">The Vastra Season</h2></Reveal>
      <div className="row g-4">{PROMOS.map(([c, t, d, b], i) => (
        <Reveal key={t} className="col-md-4" delay={i * 120}>
          <div className={`flip ${flip === i ? 'flipped' : ''}`} onClick={() => setFlip(flip === i ? null : i)} tabIndex={0} onKeyDown={e => e.key === 'Enter' && setFlip(flip === i ? null : i)}>
            <div className="flip-in">
              <div className={`face front ${c}`}><h3>{t}</h3><small>Hover to reveal</small></div>
              <div className={`face back ${c}`}><p>{d}</p><button className="btn btn-gold" onClick={e => { e.stopPropagation(); i === 2 ? onJoin() : document.getElementById('shop').scrollIntoView({ behavior: 'smooth' }); }}>{b}</button></div>
            </div>
          </div>
        </Reveal>))}</div>
    </section>);
}

const REVIEWS = [
  [5, 'The fit was perfect and the zari work is even finer in person.', 'Ananya R., Bengaluru'],
  [5, 'Ordered my wedding sherwani here. Delivered early, no alterations needed.', 'Karthik S., Chennai'],
  [4, 'My go-to for festive sarees. Packaging feels like a gift.', 'Meera P., Mumbai'],
  [5, 'Size chart was spot on. The bandhgala fit me like it was stitched for me.', 'Rohan M., Pune']];
const Stars = ({ n }) => (
  <div className="stars" role="img" aria-label={`${n} out of 5 stars`}>
    {Array.from({ length: 5 }, (_, k) => <i key={k} className={`bi ${k < n ? 'bi-star-fill' : 'bi-star'}`} style={{ '--k': k }}></i>)}
  </div>);
export function Reviews() {
  // the green colour grows from the point where the mouse enters and shrinks back to where it leaves
  const point = e => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--cx', `${e.clientX - r.left}px`); e.currentTarget.style.setProperty('--cy', `${e.clientY - r.top}px`);
  };
  return (
    <section id="reviews" className="reviews-band"><div className="container-xl">
      <Reveal><h2 className="sec-title mb-4">What Our Customers Say</h2></Reveal>
      <div className="row g-4">{REVIEWS.map((r, i) => (
        <Reveal key={r[2]} className="col-md-6 col-lg-3" delay={i * 120}>
          <blockquote className="review" tabIndex={0} onMouseEnter={point} onMouseLeave={point}>
            <i className="bi bi-quote q-mark"></i><Stars n={r[0]} /><p>“{r[1]}”</p><cite>{r[2]}</cite>
          </blockquote>
        </Reveal>))}</div>
    </div></section>);
}

export const Footer = ({ onFilter }) => (
  <footer id="contact" className="footer"><div className="container-xl"><div className="row g-4">
    <div className="col-lg-4"><a className="navbar-brand" href="#home" aria-label="Vastra"><Logo full /></a><p className="mt-3">Handcrafted ethnic and occasion wear for men and women.</p></div>
    <div className="col-6 col-lg-2"><h6>Shop</h6>
      <a href="#shop" onClick={() => onFilter('men')}>Men</a><a href="#shop" onClick={() => onFilter('women')}>Women</a>
      <a href="#bestsellers">Best Sellers</a><a href="#offers">Offers</a></div>
    <div className="col-6 col-lg-2"><h6>Help</h6><a href="#contact">Track order</a><a href="#contact">Returns</a><a href="#contact">Shipping</a><a href="#contact">FAQs</a></div>
    <div className="col-lg-4"><h6>Contact</h6>
      <p className="mb-1"><i className="bi bi-geo-alt-fill"></i> Bangalore, India</p><p className="mb-1"><i className="bi bi-envelope"></i> care@vastra.in</p><p><i className="bi bi-telephone"></i> +91 80 0000 0000</p></div>
  </div><p className="copy">© 2026 Vastra. All rights reserved.</p></div></footer>);
