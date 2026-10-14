(function () {
  "use strict";

  const data = window.portfolioData;
  const $ = (selector, root = document) => root.querySelector(selector);
  const hasText = value => typeof value === "string" && value.trim().length > 0;
  const cleanList = value => Array.isArray(value) ? value.filter(item => hasText(item)) : [];
  const text = (tag, className, value) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    element.textContent = value;
    return element;
  };
  const externalLink = (url, label, className) => {
    if (!hasText(url)) return null;
    const link = document.createElement("a");
    link.href = url;
    link.textContent = label;
    if (className) link.className = className;
    if (/^https?:/i.test(url)) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
    return link;
  };
  const hideIfEmpty = (sectionId, entries) => {
    const section = document.getElementById(sectionId);
    if (!entries) section.hidden = true;
    return !section.hidden;
  };

  function renderSkills() {
    const root = $("#skill-groups");
    const groups = (data.skills || []).filter(group => hasText(group.category) && cleanList(group.items).length);
    hideIfEmpty("skills", groups.length > 0);
    groups.forEach(group => {
      const card = document.createElement("article");
      card.className = "skill-group";
      card.append(text("span", "skill-icon mono", group.icon || "•"));
      card.append(text("h3", "skill-category", group.category));
      const chips = document.createElement("div");
      chips.className = "skill-chips";
      cleanList(group.items).forEach(item => chips.append(text("span", "skill-chip", item)));
      card.append(chips);
      root.append(card);
    });
  }

  function renderProjects() {
    const root = $("#project-grid");
    const projects = (data.projects || []).filter(project => hasText(project.name) && hasText(project.description));
    hideIfEmpty("projects", projects.length > 0);
    const hasDetails = projects.some(project => hasText(project.role) || hasText(project.architecture) || hasText(project.outcome) || cleanList(project.contributions).length || hasText(project.image));
    $("#projects-deck").textContent = hasDetails
      ? "Selected projects across backend systems and access control. Open a case file for details."
      : "Selected projects across backend systems and access control.";
    projects.forEach((project, index) => {
      const card = document.createElement("article");
      card.className = `project-card project-card-${project.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
      const cardHeader = document.createElement("div");
      cardHeader.className = "project-header";
      const icon = document.createElement("img");
      icon.className = "project-icon";
      icon.src = hasText(project.icon) ? project.icon : "assets/icon-folder.svg";
      icon.alt = "";
      icon.setAttribute("aria-hidden", "true");
      icon.addEventListener("error", () => {
        if (!icon.src.endsWith("icon-folder.svg")) icon.src = "assets/icon-folder.svg";
        else icon.hidden = true;
      });
      cardHeader.append(icon);
      const cardIdentity = document.createElement("div");
      cardIdentity.append(text("p", "project-category mono", project.category || "PROJECT"));
      cardIdentity.append(text("span", "case-number mono", `CASE FILE ${String(index + 1).padStart(2, "0")}`));
      cardHeader.append(cardIdentity);
      card.append(cardHeader);
      card.append(text("h3", "project-title", project.name));
      card.append(text("p", "project-description", project.description));
      const tags = cleanList(project.stack);
      if (tags.length) {
        const tagList = document.createElement("div");
        tagList.className = "project-tags";
        tags.forEach(tag => tagList.append(text("span", "project-tag", tag)));
        card.append(tagList);
      }
      const details = [
        ["Role", project.role], ["Architecture", project.architecture], ["Outcome", project.outcome]
      ].filter(([, value]) => hasText(value));
      const contributions = cleanList(project.contributions);
      if (details.length || contributions.length || hasText(project.image)) {
        const disclosure = document.createElement("details");
        disclosure.className = "project-details";
        const summary = document.createElement("summary");
        summary.textContent = "Open case file";
        summary.setAttribute("aria-label", `Show details for ${project.name}`);
        disclosure.addEventListener("toggle", () => {
          summary.textContent = disclosure.open ? "Close case file" : "Open case file";
          summary.setAttribute("aria-label", `${disclosure.open ? "Hide" : "Show"} details for ${project.name}`);
        });
        disclosure.append(summary);
        const body = document.createElement("div");
        body.className = "details-body";
        details.forEach(([label, value]) => {
          const row = document.createElement("p");
          row.append(text("strong", "", `${label}: `), document.createTextNode(value));
          body.append(row);
        });
        if (contributions.length) {
          const list = document.createElement("ul");
          contributions.forEach(item => list.append(text("li", "", item)));
          body.append(list);
        }
        if (hasText(project.image)) {
          const image = document.createElement("img");
          image.src = project.image;
          image.alt = hasText(project.imageAlt) ? project.imageAlt : `${project.name} project screenshot`;
          image.loading = "lazy";
          image.addEventListener("error", () => image.remove(), { once: true });
          body.append(image);
        }
        disclosure.append(body);
        card.append(disclosure);
      }
      const links = document.createElement("div");
      links.className = "project-links";
      const repo = externalLink(project.repository, "Repository ↗");
      const demo = externalLink(project.demo, "Live demo ↗");
      if (repo) links.append(repo);
      if (demo) links.append(demo);
      if (links.childElementCount) card.append(links);
      root.append(card);
    });
  }

  function renderTimeline() {
    const root = $("#timeline");
    const entries = [
      ...(data.experience || []).map(item => ({ ...item, type: item.type || "experience" })),
      ...(data.education || []).map(item => ({ ...item, title: item.degree, type: "education" }))
    ].filter(item => hasText(item.title) && (hasText(item.organization) || hasText(item.school)));
    hideIfEmpty("experience", entries.length > 0);
    entries.forEach(item => {
      const row = document.createElement("article");
      row.className = "timeline-entry";
      const marker = document.createElement("span");
      marker.className = "timeline-marker";
      marker.setAttribute("aria-hidden", "true");
      row.append(marker);
      const main = document.createElement("div");
      main.className = "timeline-main";
      main.append(text("p", "timeline-type mono", item.type === "education" ? "EDUCATION" : "EXPERIENCE"));
      main.append(text("h3", "", item.title));
      main.append(text("p", "timeline-organization", item.organization || item.school));
      if (hasText(item.description)) main.append(text("p", "timeline-description", item.description));
      cleanList(item.details).forEach(detail => main.append(text("p", "timeline-description", detail)));
      row.append(main);
      if (hasText(item.date)) row.append(text("span", "timeline-date mono", item.date));
      root.append(row);
    });
  }

  function renderRecognition() {
    const root = $("#recognition-grid");
    const awards = (data.awards || []).filter(item => hasText(item.title));
    const certifications = (data.certifications || []).filter(item => hasText(item.title));
    const entries = [...awards.map(item => ({ ...item, kind: "AWARD" })), ...certifications.map(item => ({ ...item, kind: "CERTIFICATION" }))];
    hideIfEmpty("recognition", entries.length > 0);
    entries.forEach(item => {
      const card = document.createElement("article");
      card.className = "recognition-card";
      card.append(text("span", "recognition-icon", item.kind === "AWARD" ? "✳" : "✓"));
      card.append(text("p", "recognition-kind mono", item.kind));
      card.append(text("h3", "", item.title));
      if (hasText(item.organization || item.issuer)) card.append(text("p", "recognition-issuer", item.organization || item.issuer));
      if (hasText(item.description)) card.append(text("p", "recognition-description", item.description));
      if (hasText(item.date)) card.append(text("span", "recognition-date mono", item.date));
      const link = externalLink(item.credentialUrl, "View credential ↗", "credential-link");
      if (link) card.append(link);
      root.append(card);
    });
  }

  function renderLabs() {
    const root = $("#labs-grid");
    const entries = [
      ...(data.labs || []).filter(item => hasText(item.title)).map(item => ({ ...item, kind: "LAB" })),
      ...(data.infrastructure || []).filter(item => hasText(item.title)).map(item => ({ ...item, kind: "INFRASTRUCTURE" }))
    ];
    hideIfEmpty("labs", entries.length > 0);
    entries.forEach(item => {
      const card = document.createElement("article");
      card.className = "lab-card";
      card.append(text("span", "lab-kind mono", item.kind));
      card.append(text("h3", "", item.title));
      if (hasText(item.summary)) card.append(text("p", "", item.summary));
      const tools = cleanList(item.tools);
      if (tools.length) card.append(text("p", "lab-tools mono", tools.join(" · ")));
      const link = externalLink(item.url, "Explore ↗", "project-link");
      if (link) card.append(link);
      root.append(card);
    });
  }

  function renderContacts() {
    const root = $("#contact-links");
    const contacts = (data.profile.contacts || []).filter(item => hasText(item.url) && hasText(item.label));
    hideIfEmpty("contact", contacts.length > 0);
    contacts.forEach(contact => {
      const link = externalLink(contact.url, "", "contact-link");
      link.append(text("span", "contact-icon", contact.icon || "↗"));
      const details = document.createElement("span");
      details.append(text("small", "", contact.label), text("strong", "", contact.text || contact.url));
      link.append(details, text("span", "contact-arrow", "↗"));
      root.append(link);
    });
  }

  function render() {
    if (!data || !data.profile) return;
    const profile = data.profile;
    document.querySelectorAll('[data-profile="name"]').forEach(node => { node.textContent = profile.name || "Portfolio"; });
    const initials = hasText(profile.photoFallback)
      ? profile.photoFallback
      : (profile.name || "JP").split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join("").toUpperCase();
    document.querySelectorAll('[data-profile="initials"]').forEach(node => { node.textContent = initials; });
    document.title = `${profile.name || "Portfolio"} | ${profile.title || "Portfolio"}`;
    const description = document.querySelector('meta[name="description"]');
    if (description && hasText(profile.introduction)) description.content = profile.introduction;
    const socialTitle = document.querySelector('meta[property="og:title"]');
    const socialDescription = document.querySelector('meta[property="og:description"]');
    if (socialTitle) socialTitle.content = document.title;
    if (socialDescription) socialDescription.content = profile.introduction || profile.headline || "";
    $("#hero-title").textContent = profile.headline || "Building thoughtful systems.";
    $("#profile-title").textContent = profile.title || "Computer Engineering student";
    $("#profile-focus").textContent = profile.focus || "Cybersecurity · Networking";
    $("#hero-intro").textContent = profile.introduction || "";
    const photo = $("#profile-photo");
    const portraitFallback = $("#portrait-fallback");
    portraitFallback.textContent = initials;
    $("#hero-role-label").textContent = (profile.title || "Computer Engineering student").toUpperCase();
    if (hasText(profile.photo)) {
      photo.alt = `Portrait of ${profile.name || "portfolio owner"}`;
      photo.addEventListener("load", () => { photo.hidden = false; portraitFallback.hidden = true; }, { once: true });
      photo.addEventListener("error", () => { photo.hidden = true; portraitFallback.hidden = false; }, { once: true });
      photo.src = profile.photo;
    }
    $("#about-lead").textContent = profile.aboutLead || "";
    $("#about-body").textContent = profile.aboutBody || "";
    const focuses = cleanList(profile.targetRoles);
    const about = $("#about");
    if (!hasText(profile.aboutLead) && !hasText(profile.aboutBody) && !focuses.length) about.hidden = true;
    focuses.forEach(item => $("#focus-list").append(text("span", "focus-item", item)));

    const facts = [profile.location, profile.availability, profile.graduation].filter(hasText);
    if (facts.length) {
      const factsRoot = $("#hero-facts");
      factsRoot.hidden = false;
      facts.forEach((fact, index) => {
        if (index) factsRoot.append(text("span", "fact-divider", "/"));
        factsRoot.append(text("span", "", fact));
      });
    }
    if (hasText(profile.resume)) {
      const resume = $("#resume-link");
      resume.href = profile.resume;
      resume.hidden = false;
    }

    const featuredAward = (data.awards || []).find(item => hasText(item.title));
    if (featuredAward) {
      $("#hero-award").hidden = false;
      $("#hero-award-text").textContent = `${featuredAward.title}${hasText(featuredAward.date) ? ` · ${featuredAward.date}` : ""}`;
    }

    renderSkills();
    renderProjects();
    renderTimeline();
    renderRecognition();
    renderLabs();
    renderContacts();
    if (hasText(profile.email)) $("#contact-copy").textContent = "Interested in internship opportunities or technical collaboration? Send me a message and let’s connect.";
    else $("#contact-copy").textContent = "Interested in connecting? Find me through one of the links below.";
    $("#year").textContent = new Date().getFullYear();

    const nav = $("#site-nav");
    const navSections = [
      ["Skills", "skills"], ["Projects", "projects"], ["About", "about"], ["Experience", "experience"], ["Recognition", "recognition"], ["Labs", "labs"]
    ];
    navSections.forEach(([label, id]) => {
      if (!document.getElementById(id).hidden) {
        const link = document.createElement("a");
        link.href = `#${id}`;
        link.textContent = label;
        nav.append(link);
      }
    });
    const projectsCta = $("#projects-cta");
    const contactCta = $("#contact-cta");
    const navContact = $(".nav-contact");
    projectsCta.hidden = document.getElementById("projects").hidden;
    contactCta.hidden = document.getElementById("contact").hidden;
    navContact.hidden = document.getElementById("contact").hidden;

    const qualifications = $(".qualifications");
    const visiblePanels = [...qualifications.querySelectorAll(".qualification-panel")].filter(panel => !panel.hidden).length;
    qualifications.classList.toggle("qualifications--single", visiblePanels === 1);

    const menu = $(".menu-toggle");
    const closeMenu = restoreFocus => {
      menu.setAttribute("aria-expanded", "false");
      menu.setAttribute("aria-label", "Open navigation");
      nav.classList.remove("is-open");
      if (restoreFocus) menu.focus();
    };
    menu.addEventListener("click", () => {
      const open = menu.getAttribute("aria-expanded") === "true";
      menu.setAttribute("aria-expanded", String(!open));
      menu.setAttribute("aria-label", open ? "Open navigation" : "Close navigation");
      nav.classList.toggle("is-open", !open);
    });
    nav.addEventListener("click", event => {
      if (event.target.closest("a")) closeMenu(false);
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && menu.getAttribute("aria-expanded") === "true") closeMenu(true);
    });
    document.addEventListener("click", event => {
      if (menu.getAttribute("aria-expanded") === "true" && !nav.contains(event.target) && !menu.contains(event.target)) closeMenu(false);
    });
    window.matchMedia("(min-width: 681px)").addEventListener("change", event => {
      if (event.matches) closeMenu(false);
    });

    const navLinks = [...nav.querySelectorAll("a")];
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(entries => {
        const active = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!active) return;
        navLinks.forEach(link => {
          if (link.hash === `#${active.target.id}`) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      }, { rootMargin: "-18% 0px -68% 0px", threshold: [0, .1, .25, .5] });
      navLinks.forEach(link => {
        const target = document.querySelector(link.hash);
        if (target) observer.observe(target);
      });
    }

    let openBeforePrint = [];
    window.addEventListener("beforeprint", () => {
      const disclosures = [...document.querySelectorAll(".project-details")];
      openBeforePrint = disclosures.filter(item => item.open);
      disclosures.forEach(item => { item.open = true; });
    });
    window.addEventListener("afterprint", () => {
      document.querySelectorAll(".project-details").forEach(item => { item.open = openBeforePrint.includes(item); });
      openBeforePrint = [];
    });
  }

  document.addEventListener("DOMContentLoaded", render);
})();
