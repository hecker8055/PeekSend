import { Link } from "react-router-dom";
function Hero({ styles }) {
  return (
    <div className={styles.heroDiv}>
      <nav className={styles.headerNav} id="nvbar" aria-label="Primary">
        <a className={styles.logoA} href="/" aria-current="page">
          PeekSend
        </a>
        <div className={styles.menuDiv}>
          <Link to="/sign-in" className={styles.loginButton}>
            Login
          </Link>
          <Link to="/sign-up" className={styles.buttonPrimaryWithIcon2}>
            <span className={styles.buttonName3}>Sign up</span>
          </Link>
        </div>
      </nav>

      <div className={styles.contentDiv2}>
        <h1 className={styles.smartEmailStatusFinderMa}>
          Smart email status finder, made for Everyone
        </h1>
        <p className={styles.knowIfYourEmailHasBeenRe}>
          Know if your email has been read
        </p>

        <div className={styles.buttonsDiv}>
          <Link to="/sign-up" className={styles.buttonPrimaryWithIcon1}>
            <span className={styles.buttonName1}>Get started now</span>
            <img
              className={styles.iconOutlinearrowRight}
              alt="Arrow right icon"
              src="../iconoutlinearrowright5.svg"
              aria-hidden="true"
            />
          </Link>
        </div>

        <p className={styles.createYourAccountForFree}>
          Create your account. For free of cost
        </p>
      </div>
    </div>
  );
}

export default Hero;
