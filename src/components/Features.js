import React from "react";
import { MdAttachEmail } from "react-icons/md";
import { FaCircleCheck } from "react-icons/fa6";
import { FaHistory } from "react-icons/fa";

function Features({ styles }) {
  const features = [
    {
      icon: <MdAttachEmail />,
      title: "Send",
      description: "Compose a new email with pixel tracking enabled.",
    },
    {
      icon: <FaCircleCheck />,
      title: "Status",
      description: "Know if the user read the email or not.",
    },
    {
      icon: <FaHistory />,
      title: "History",
      description: "Find out exactly when the receiver read your mail.",
    },
  ];

  return (
    <section id="features" className={styles.featureSection}>
      {/* Header */}
      <div className={styles.featureHeader}>
        <h2 className={styles.featureTitle}>Use email like a geek</h2>
        <p className={styles.featureSubtitle}>
          Explore the unexplored potential of email
        </p>
      </div>

      {/* Features List */}
      <div className={styles.featureList}>
        {features.map((feature, index) => (
          <div className={styles.featureCard} key={index}>
            <div className={styles.featureIcon}>{feature.icon}</div>
            <h3 className={styles.featureCardTitle}>{feature.title}</h3>
            <p className={styles.featureCardDesc}>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;
