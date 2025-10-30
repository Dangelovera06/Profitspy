import * as React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "./Button";
import './Hero.css';

const Hero = React.forwardRef(
  (
    {
      className = "",
      gradient = true,
      blur = true,
      title,
      subtitle,
      actions = [],
      titleClassName = "",
      subtitleClassName = "",
      actionsClassName = "",
      ...props
    },
    ref
  ) => {
    return (
      <section
        ref={ref}
        className={`hero-root ${className}`}
        {...props}
      >
        {gradient && (
          <div className="hero-gradient-container">
            {blur && (
              <div className="hero-blur-overlay" />
            )}

            {/* Main glow */}
            <div className="hero-main-glow" />

            {/* Lamp effect */}
            <motion.div
              initial={{ width: "8rem" }}
              viewport={{ once: true }}
              transition={{ ease: "easeInOut", delay: 0.3, duration: 0.8 }}
              whileInView={{ width: "16rem" }}
              className="hero-lamp"
            />

            {/* Top line */}
            <motion.div
              initial={{ width: "15rem" }}
              viewport={{ once: true }}
              transition={{ ease: "easeInOut", delay: 0.3, duration: 0.8 }}
              whileInView={{ width: "30rem" }}
              className="hero-top-line"
            />

            {/* Left gradient cone */}
            <motion.div
              initial={{ opacity: 0.5, width: "15rem" }}
              whileInView={{ opacity: 1, width: "30rem" }}
              transition={{
                delay: 0.3,
                duration: 0.8,
                ease: "easeInOut",
              }}
              className="hero-cone-left"
            >
              <div className="hero-cone-mask-bottom" />
              <div className="hero-cone-mask-left" />
            </motion.div>

            {/* Right gradient cone */}
            <motion.div
              initial={{ opacity: 0.5, width: "15rem" }}
              whileInView={{ opacity: 1, width: "30rem" }}
              transition={{
                delay: 0.3,
                duration: 0.8,
                ease: "easeInOut",
              }}
              className="hero-cone-right"
            >
              <div className="hero-cone-mask-right-side" />
              <div className="hero-cone-mask-bottom-right" />
            </motion.div>
          </div>
        )}

        <motion.div
          initial={{ y: 100, opacity: 0.5 }}
          viewport={{ once: true }}
          transition={{ ease: "easeInOut", delay: 0.3, duration: 0.8 }}
          whileInView={{ y: 0, opacity: 1 }}
          className="hero-content-wrapper"
        >
          <div className="hero-content">
            <h1 className={`hero-title ${titleClassName}`}>
              {title}
            </h1>
            {subtitle && (
              <p className={`hero-subtitle ${subtitleClassName}`}>
                {subtitle}
              </p>
            )}
            {actions && actions.length > 0 && (
              <div className={`hero-actions ${actionsClassName}`}>
                {actions.map((action, index) => (
                  <Button
                    key={index}
                    variant={action.variant || "default"}
                    size={action.size || "lg"}
                    asChild
                  >
                    <Link to={action.href}>{action.label}</Link>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </section>
    );
  }
);

Hero.displayName = "Hero";

export { Hero };

