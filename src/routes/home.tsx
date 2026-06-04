const Home: Component<
  {},
  {
    benefits: Benefit[]
  }
> = function () {
  this.css = `
    .hero {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 100px 50px;
        overflow: hidden;
        text-align: center;
    }

    .hero::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(circle at center, rgba(136, 176, 255, 0.3), rgba(178, 89, 232, 0.45));
        opacity: 0.5;
        z-index: 0;
        background-size: cover;
    }

    .hero-text {
        position: relative;
        z-index: 1;
        max-width: 600px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .hero-text h2 {
        font-size: 2.5rem;
        line-height: 1.2;
        font-weight: 500;
    }

    .hero-text h1 {
        --bg-size: 400%;
        font-size: 5rem;
        animation: move-bg 10s linear infinite;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 650;
    }

    @keyframes move-bg {
        to {
            background-position: var(--bg-size) 0;
        }
    }

    .hero-text p {
        margin: 20px 0;
        font-size: 1.25rem;
        line-height: 1.6;
        font-weight: normal;
    }

    .btn-wrap {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 12px;
    }

    .more-btn,
    .more-btn:visited {
        display: inline-block;
        background: linear-gradient(45deg, var(--surface1), var(--surface1));
        color: var(--accent0);
        padding: 10px 20px;
        border-radius: 99px;
        font-weight: bold;
        text-decoration: none;
        transition: background 0.3s, color 0.3s;
        cursor: pointer;
        border: 2px solid transparent;
        background-clip: padding-box;
        box-shadow: 0 0 0 2px var(--accent0);
    }

    .more-btn:hover {
        background: linear-gradient(45deg, var(--accent0), var(--accent1));
        transition: background 0.3s, color 0.3s;
        color: #fff;
    }

    .benefits {
        background-color: var(--bg);
        padding: 50px 0;
        text-align: center;
    }

    .benefits-container {
        max-width: 1000px;
        margin: 0 auto;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 30px;
    }

    @media (orientation: portrait) {

        .hero-text h1 {
            font-size: 4em;
        }

        .hero-text p {
            font-size: 1.4em;
        }

        .benefits-container {
            padding: 0 15px;
            padding-inline: 15px;
            gap: 25px;
        }
        .benefit-item {
            width: calc(100vw - 30px);
            /* padding: 20px 15px; */
            /* margin-bottom: 20px; */
        }
        .benefit-item:last-child {
            margin-bottom: 0;
        }
    }

    @media (orientation: landscape) {
        .benefit-title {
            font-size: 1.75em;
        }

        .benefit-content p {
            font-size: 1.1em;
        }
    }
    `;

    this.benefits = [
        new Benefit('⚙️', 'Easy to Use', 'Sign IPA files effortlessly by simply clicking on them in app.'),
        new Benefit('📱', 'On-device', 'QuickSign operates fully on-device, ensuring seamless application signing with no contact to any servers.'),
        new Benefit('💻', 'No Computer', 'You can use QuickSign without the need of a computer.'),
        new Benefit('🔒', 'Spyware Free', 'Unlike some other competitors, the code is free of any spyware or analytics software.'),
        new Benefit('📦', 'Tweak Injection', 'Easily inject tweaks into your apps, without the headache.'),
        new Benefit('🔄', 'Easy Updates', 'Update QuickSign in-app, eliminating the need for manual IPA file downloads.'),
    ]

  return (
    <div>
      <section class="hero">
        <div class="hero-text">
          <h2>Introducing</h2>
          <h1>QuickSign</h1>
          <p>a local development certificate signer for iOS devices.</p>
          <div class="btn-wrap">
            <a href="/lqs" class="more-btn">libqsign</a>
            <a href="https://x.com/QuickSigniOS" class="more-btn" download>
              eta son™
            </a>
          </div>
        </div>
      </section>

      <section class="benefits">
        <div class="benefits-container">
          {use(this.benefits, (benefits) =>
            benefits.map((benefit) => <BenefitCard b={benefit} />)        
          )}
        </div>
      </section>
    </div>
  );
};

class Benefit {
    icon: string;
    title: string;
    detail: string;
    constructor(icon: string, title: string, detail: string) {
        this.icon = icon;
        this.title = title;
        this.detail = detail;
    }
}

const BenefitCard: Component<{b: Benefit}, {flip: boolean}> = function()  {
    this.flip = false

    this.css = `
    border-radius: 10px;
    width: calc(33% - 60px);
    min-width: 250px;
    display: flex;
    align-items: center;
    text-align: left;

    .benefit-inner {
        padding: 1.5rem;
        border-radius: 10px;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
        background-color: var(--surface0);
        transition: transform ease 0.3s, box-shadow ease 0.3s;
        cursor: pointer; 
        transform-style: preserve-3d;
        perspective: 1000px;
    }

    h2 {
        margin-top: 0.25em;
    }

    .benefit-inner:hover {
        transform: translateY(-5px);
        box-shadow: 0 0 20px rgba(136, 176, 255, 0.5);
    }

    .benefit-inner.flip {
        transition: transform ease 0.3s, box-shadow ease 0.3s;
        transform: rotateY(180deg);
    }

    .benefit-inner.flip:hover {
        transform: rotateY(180deg) translateY(-5px);
    }

    .icon {
        font-size: 2.5em;
        margin-right: 20px;
        color: var(--accent0);
    }

    .benefit-content {
        display: flex;
        flex-direction: column;
    }

    .benefit-title {
        font-size: 1.5em;
        margin-bottom: 10px;
    }

    .benefit-content p {
        font-size: 1em;
        color: #ccc;
    }

    .benefit-inner {
        width: 100%;
        height: 100%;
        position: relative;
    }

    .benefit-front,
    .benefit-back {
        position: relative;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        backface-visibility: hidden;
    }

    .benefit-back {
        position: absolute;
        transform: rotateY(180deg);
        padding: 1.5rem;
    }

    @media(pointer: coarse) {
        .benefit-inner:hover {
            transform: none!important;
            box-shadow: none!important;
        }

        .benefit-inner.flip:hover {
            transform: rotateY(180deg)!important;
        }
    }
    `

    

    return (
        <div class="benefit-item" class:flip={use(this.flip)} on:click={()=>{this.flip = !this.flip}}>
            <div class="benefit-inner" class:flip={use(this.flip)}>
            <div class="benefit-front">
                <div class="icon">{this.b.icon}</div>
                <div class="benefit-content">
                    <h2 class="benefit-title">{this.b.title}</h2>
                    <p>{this.b.detail}</p>
                </div>
            </div>
            <div class="benefit-back">hello there</div>
            </div>
        </div>
    )
}

export default Home;
