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
    const hasDetails = projects.some(project => cleanList(project.overview).length || hasText(project.association) || hasText(project.collaborators) || hasText(project.role) || hasText(project.architecture) || hasText(project.outcome) || cleanList(project.contributions).length || hasText(project.image));
    $("#projects-deck").textContent = hasDetails
      ? "Tools, applications, and experiments. Open a project to read more."
      : "A few projects across security, web development, and self-hosting.";
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
      cardIdentity.append(text("span", "case-number mono", `/ ${String(index + 1).padStart(2, "0")}`));
      cardHeader.append(cardIdentity);
      card.append(cardHeader);
      card.append(text("h3", "project-title", project.name));
      if (hasText(project.date)) card.append(text("p", "project-date mono", project.date));
      card.append(text("p", "project-description", project.description));
      const tags = [...new Set([...cleanList(project.stack), ...cleanList(project.skills)])];
      if (tags.length) {
        const tagList = document.createElement("div");
        tagList.className = "project-tags";
        tags.forEach(tag => tagList.append(text("span", "project-tag", tag)));
        card.append(tagList);
      }
      const details = [
        ["Role", project.role], ["Architecture", project.architecture], ["Outcome", project.outcome],
        ["Associated with", project.association], ["Other contributors", project.collaborators]
      ].filter(([, value]) => hasText(value));
      const contributions = cleanList(project.contributions);
      const overview = cleanList(project.overview);
      if (details.length || overview.length || contributions.length || hasText(project.image)) {
        const disclosure = document.createElement("details");
        disclosure.className = "project-details";
        const summary = document.createElement("summary");
        summary.textContent = "Show more +";
        summary.setAttribute("aria-label", `Show details for ${project.name}`);
        disclosure.addEventListener("toggle", () => {
          summary.textContent = disclosure.open ? "Show less −" : "Show more +";
          summary.setAttribute("aria-expanded", String(disclosure.open));
          summary.setAttribute("aria-label", `${disclosure.open ? "Hide" : "Show"} details for ${project.name}`);
        });
        disclosure.append(summary);
        const body = document.createElement("div");
        body.className = "details-body";
        overview.forEach(paragraph => body.append(text("p", "", paragraph)));
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
    const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    const startDate = item => {
      const match = (item.date || "").match(/^(?:([A-Za-z]+)\s+)?(\d{4})\b/);
      if (!match) return -1;
      const month = match[1] ? months.indexOf(match[1].slice(0, 3).toLowerCase()) : 0;
      return Number(match[2]) * 12 + Math.max(0, month);
    };
    const entries = [
      ...(data.experience || []).map(item => ({ ...item, type: item.type || "experience" })),
      ...(data.education || []).map(item => ({ ...item, title: item.degree, type: "education" }))
    ].filter(item => hasText(item.title) && (hasText(item.organization) || hasText(item.school)))
      .sort((a, b) => startDate(b) - startDate(a));
    entries.filter(item => hasText(item.displayAfter)).forEach(item => {
      const target = entries.find(entry => entry.id === item.displayAfter);
      if (!target || target === item) return;
      entries.splice(entries.indexOf(item), 1);
      entries.splice(entries.indexOf(target) + 1, 0, item);
    });
    hideIfEmpty("experience", entries.length > 0);
    entries.forEach(item => {
      const row = document.createElement("article");
      row.className = "timeline-entry";
      row.dataset.timelineGroup = item.timelineGroup || (item.type === "education" ? "learning" : item.type === "organization" ? "organization" : "development");
      row.style.setProperty("--entry-order", String(root.childElementCount));
      if (item.milestone) {
        row.classList.add("timeline-milestone");
        row.append(text("h3", "", item.title));
        if (hasText(item.date)) row.append(text("span", "timeline-date mono", item.date));
        root.append(row);
        return;
      }
      const marker = document.createElement("span");
      marker.className = "timeline-marker";
      marker.setAttribute("aria-hidden", "true");
      row.append(marker);
      const main = document.createElement("div");
      main.className = "timeline-main";
      main.append(text("p", "timeline-type mono", item.type === "education" ? "EDUCATION" : item.type === "organization" ? "ORGANIZATION" : "EXPERIENCE"));
      main.append(text("h3", "", item.title));
      main.append(text("p", "timeline-organization", item.organization || item.school));
      if (hasText(item.association)) main.append(text("p", "timeline-description", `Associated with ${item.association}`));
      if (hasText(item.description)) main.append(text("p", "timeline-description", item.description));
      cleanList(item.details).forEach(detail => main.append(text("p", "timeline-description", detail)));
      row.append(main);
      if (hasText(item.date)) row.append(text("span", "timeline-date mono", item.date));
      root.append(row);
    });
  }

  function renderRecognition() {
    const awards = (data.awards || []).filter(item => hasText(item.title));
    const achievements = (data.achievements || []).filter(item => hasText(item.title));
    const certifications = (data.certifications || []).filter(item => hasText(item.title));
    const badges = (data.badges || []).filter(item => hasText(item.title));
    const groups = [
      { section: "recognition", root: "#recognition-grid", entries: [...awards.map(item => ({ ...item, kind: "AWARD" })), ...achievements.map(item => ({ ...item, kind: "ACHIEVEMENT" }))] },
      { section: "certifications", root: "#certifications-grid", entries: [
        ...certifications.map(item => ({ ...item, kind: "Certification" })),
        ...badges.map(item => ({ ...item, kind: "Badge" }))
      ].sort((a, b) => (Date.parse(`1 ${b.date}`) || 0) - (Date.parse(`1 ${a.date}`) || 0)) }
    ];
    groups.forEach(group => {
      const root = $(group.root);
      hideIfEmpty(group.section, group.entries.length > 0);
      group.entries.forEach(item => {
      const card = document.createElement("article");
      card.className = "recognition-card";
      card.classList.add("credential-disclosure");
      const summary = document.createElement("summary");
      summary.className = "credential-summary";
      summary.setAttribute("aria-expanded", "false");
      summary.setAttribute("aria-label", `Show details for ${item.title}`);
      summary.append(text("span", "recognition-icon", item.kind === "AWARD" || item.kind === "ACHIEVEMENT" ? "✳" : "✓"));
      summary.append(text("span", `recognition-kind mono${group.section === "certifications" ? " credential-type credential-type-" + item.kind.toLowerCase() : ""}`, item.kind));
      summary.append(text("span", "recognition-title", item.title));
      if (hasText(item.organization || item.issuer)) summary.append(text("span", "recognition-issuer", item.organization || item.issuer));
      if (hasText(item.date)) summary.append(text("span", "recognition-date mono", `Issued ${item.date}`));
      summary.append(text("span", "credential-open-hint mono", "Open details +"));
      card.append(summary);
      const detailPanel = document.createElement("div");
      detailPanel.className = "credential-details-panel";
      if (hasText(item.description)) detailPanel.append(text("p", "recognition-description", item.description));
      if (hasText(item.expires)) detailPanel.append(text("p", "recognition-date mono", `Expires ${item.expires}`));
      if (hasText(item.credentialId)) detailPanel.append(text("p", "credential-id mono", `Credential ID: ${item.credentialId}`));
      const skills = cleanList(item.skills);
      if (skills.length) detailPanel.append(text("p", "recognition-description credential-skills", `Skills: ${skills.join(", ")}`));
      const link = externalLink(item.credentialUrl || "https://www.linkedin.com/in/john-rhey-pena/details/certifications/", "Open LinkedIn credential list ↗", "credential-link");
      if (link) detailPanel.append(link);
      card.append(detailPanel);
      card.addEventListener("toggle", () => {
        summary.setAttribute("aria-expanded", String(card.open));
        summary.setAttribute("aria-label", `${card.open ? "Hide" : "Show"} details for ${item.title}`);
        const hint = summary.querySelector(".credential-open-hint");
        hint.textContent = card.open ? "Close details −" : "Open details +";
      });
      root.append(card);
      });
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

  const transitions = new Map();
  function finishTransition(root) {
    const transition = transitions.get(root);
    if (transition) {
      transition.animation.finish();
      transition.complete();
    }
  }

  function pixelTransition(root, apply) {
    finishTransition(root);
    if (!root.animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      apply();
      return;
    }
    const previous = [...root.children].map(child => [child, child.hidden]);
    const wasOpen = root.open;
    const before = root.getBoundingClientRect().height;
    apply();
    const after = root.getBoundingClientRect().height;
    if (before === after) return;
    // Keep the outgoing content visible while the frame closes over it.
    if (after < before) {
      previous.forEach(([child, hidden]) => { child.hidden = hidden; });
      if (typeof wasOpen === 'boolean') root.open = wasOpen;
    }
    const overflow = root.style.overflow;
    root.style.overflow = 'hidden';
    const animation = root.animate([{ height: before + 'px' }, { height: after + 'px' }], {
      duration: 260, easing: 'steps(6, end)'
    });
    const complete = () => {
      animation.onfinish = null;
      animation.oncancel = null;
      apply();
      root.style.overflow = overflow;
      transitions.delete(root);
    };
    transitions.set(root, { animation, complete });
    animation.onfinish = complete;
    animation.oncancel = complete;
  }

  function setupFold(rootSelector, buttonSelector, limit, label) {
    const root = $(rootSelector);
    const button = $(buttonSelector);
    const items = [...root.children];
    if (items.length <= limit) return;
    button.hidden = false;
    let expanded = false;
    const apply = () => items.forEach((item, index) => {
      item.hidden = !expanded && index >= limit;
      if (!item.hidden) item.classList.add('pixel-visible');
    });
    const updateButton = () => {
      button.setAttribute('aria-expanded', String(expanded));
      button.textContent = expanded ? 'Show less −' : 'Show more ' + label + ' (' + (items.length - limit) + ') +';
    };
    apply();
    updateButton();
    button.addEventListener('click', () => {
      finishTransition(root);
      expanded = !expanded;
      updateButton();
      pixelTransition(root, apply);
    });
    window.addEventListener('beforeprint', () => {
      finishTransition(root);
      items.forEach(item => { item.hidden = false; });
    });
    window.addEventListener('afterprint', apply);
  }

  function setupInteractions() {
    setupPageEffects();
    const cards = [...document.querySelectorAll('.project-card')];
    const projects = (data.projects || []).filter(project => hasText(project.name) && hasText(project.description));
    const groups = { Whidra: 'Security', phishIv2: 'Security', LockMate: 'Systems', SANWANV2: 'Systems', MDSystem: 'Web apps', CookEat: 'Web apps' };
    const filters = $('#project-filters');
    ['All', ...new Set(projects.map(project => groups[project.name] || 'Other'))].forEach(label => {
      const button = text('button', 'filter-button', label);
      button.type = 'button';
      button.setAttribute('aria-pressed', String(label === 'All'));
      button.setAttribute('aria-controls', 'project-grid');
      button.addEventListener('click', () => {
        filters.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
        let count = 0;
        cards.forEach((card, index) => {
          card.hidden = label !== 'All' && (groups[projects[index].name] || 'Other') !== label;
          if (!card.hidden) card.classList.add('pixel-visible');
          if (!card.hidden) count++;
        });
        $('#filter-status').textContent = count + ' projects shown' + (label === 'All' ? '' : ' in ' + label);
      });
      filters.append(button);
    });
    filters.hidden = cards.length < 2;

    setupTimelineFilters();

    setupFold('#certifications-grid', '#credentials-toggle', 4, 'credentials');
    document.querySelectorAll('.project-details').forEach(disclosure => {
      const summary = disclosure.querySelector('summary');
      summary.setAttribute('aria-expanded', String(disclosure.open));
      summary.addEventListener('click', event => {
        event.preventDefault();
        finishTransition(disclosure);
        const expanded = !disclosure.open;
        pixelTransition(disclosure, () => {
          disclosure.open = expanded;
          summary.textContent = expanded ? 'Show less −' : 'Show more +';
          summary.setAttribute('aria-expanded', String(expanded));
          summary.setAttribute('aria-label', (expanded ? 'Hide' : 'Show') + ' project details');
        });
      });
    });
    document.querySelectorAll('.credential-disclosure').forEach(disclosure => {
      const summary = disclosure.querySelector('summary');
      summary.addEventListener('click', event => {
        event.preventDefault();
        finishTransition(disclosure);
        const expanded = !disclosure.open;
        pixelTransition(disclosure, () => { disclosure.open = expanded; });
      });
    });

    const copy = $('#copy-email');
    if (hasText(data.profile.email) && navigator.clipboard && window.isSecureContext) {
      copy.hidden = false;
      copy.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(data.profile.email);
          $('#copy-status').textContent = 'Email copied.';
        } catch {
          $('#copy-status').textContent = 'Email: ' + data.profile.email;
        }
      });
    }
  }

  function setupPageEffects() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const targets = [...document.querySelectorAll('.section-topline, .toolbox-window, .skill-group, .project-card, .qualification-panel, .timeline-entry, .recognition-card, .lab-card, .contact-panel')];
    if (reducedMotion || !('IntersectionObserver' in window)) {
      targets.forEach(target => target.classList.add('pixel-visible'));
    } else {
      document.body.classList.add('pixel-effects-ready');
      const observer = new IntersectionObserver(entries => {
        entries.forEach((entry, index) => {
          if (!entry.isIntersecting) return;
          entry.target.style.setProperty('--pixel-delay', `${Math.min(index, 6) * 35}ms`);
          entry.target.classList.add('pixel-visible');
          observer.unobserve(entry.target);
        });
      }, { rootMargin: '0px 0px -7% 0px', threshold: 0.08 });
      targets.forEach(target => observer.observe(target));
    }

    const progress = $('#page-progress');
    const progressFill = progress.querySelector('span');
    const backToTop = $('#back-to-top');
    let scheduled = false;
    const updatePagePosition = () => {
      scheduled = false;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const amount = scrollable > 0 ? Math.min(100, Math.max(0, Math.round(window.scrollY / scrollable * 100))) : 0;
      progress.setAttribute('aria-valuenow', String(amount));
      progressFill.style.transform = `scaleX(${amount / 100})`;
      backToTop.hidden = window.scrollY < 480;
    };
    const schedulePagePosition = () => {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(updatePagePosition);
    };
    window.addEventListener('scroll', schedulePagePosition, { passive: true });
    window.addEventListener('resize', schedulePagePosition);
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' }));
    updatePagePosition();
  }

  function setupTimelineFilters() {
    const root = $('#timeline');
    const filters = $('#timeline-filters');
    const toggle = $('#experience-toggle');
    const status = $('#timeline-status');
    const entries = [...root.children];
    const groups = [
      ['all', 'All'], ['organization', 'Organizations'], ['learning', 'Learning'], ['development', 'Development']
    ].filter(([key]) => key === 'all' || entries.some(entry => entry.dataset.timelineGroup === key));
    let active = 'all';
    let expanded = false;
    const visibleEntries = () => entries.filter(entry => active === 'all' || entry.dataset.timelineGroup === active);
    const apply = () => {
      const visible = visibleEntries();
      entries.forEach(entry => {
        entry.hidden = !visible.includes(entry) || (!expanded && visible.indexOf(entry) >= 3);
        if (!entry.hidden) entry.classList.add('pixel-visible');
      });
      const remaining = Math.max(0, visible.length - 3);
      toggle.hidden = remaining === 0;
      toggle.setAttribute('aria-expanded', String(expanded));
      toggle.textContent = expanded ? 'Show less −' : `Show ${remaining} more ${active === 'all' ? 'timeline entries' : groups.find(([key]) => key === active)?.[1].toLowerCase()} +`;
      status.textContent = `Showing ${visible.length} ${active === 'all' ? 'timeline entries' : groups.find(([key]) => key === active)?.[1].toLowerCase()}`;
    };
    groups.forEach(([key, label]) => {
      const button = text('button', 'filter-button', label);
      button.type = 'button';
      button.setAttribute('aria-pressed', String(key === active));
      button.addEventListener('click', () => {
        active = key;
        expanded = false;
        filters.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
        pixelTransition(root, apply);
      });
      filters.append(button);
    });
    toggle.addEventListener('click', () => {
      expanded = !expanded;
      toggle.setAttribute('aria-expanded', String(expanded));
      pixelTransition(root, apply);
    });
    window.addEventListener('beforeprint', () => {
      finishTransition(root);
      entries.forEach(entry => { entry.hidden = false; });
    });
    window.addEventListener('afterprint', () => pixelTransition(root, apply));
    apply();
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
    const achievements = (data.achievements || []).filter(item => hasText(item.title));
    const deanRecognitions = achievements.filter(item => /dean['’]?s?\s+list/i.test(item.title));
    if (featuredAward || achievements.length) $("#hero-award").hidden = false;
    if (featuredAward) {
      $("#hero-award-text").hidden = false;
      $("#hero-award-text").textContent = `${featuredAward.title}${hasText(featuredAward.date) ? ` · ${featuredAward.date}` : ""}`;
    }
    if (achievements.length) {
      const highlight = $("#hero-achievement-text");
      highlight.hidden = false;
      highlight.textContent = deanRecognitions.length
        ? `Dean’s Lister · ${deanRecognitions.length} ${deanRecognitions.length === 1 ? "recognition" : "recognitions"}`
        : achievements[0].title;
    }

    renderSkills();
    renderProjects();
    renderTimeline();
    renderRecognition();
    renderLabs();
    renderContacts();
    setupInteractions();
    if (hasText(profile.email)) $("#contact-copy").textContent = "Interested in internship opportunities or technical collaboration? Send me a message and let’s connect.";
    else $("#contact-copy").textContent = "Interested in connecting? Find me through one of the links below.";
    $("#year").textContent = new Date().getFullYear();

    const nav = $("#site-nav");
    const navSections = [
      ["Skills", "skills"], ["Projects", "projects"], ["About", "about"], ["Experience", "experience"], ["Awards", "recognition"], ["Certifications", "certifications"], ["Labs", "labs"]
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
      [...transitions.keys()].forEach(finishTransition);
      const disclosures = [...document.querySelectorAll(".project-details, .credential-disclosure")];
      openBeforePrint = disclosures.filter(item => item.open);
      disclosures.forEach(item => { item.open = true; });
    });
    window.addEventListener("afterprint", () => {
      document.querySelectorAll(".project-details, .credential-disclosure").forEach(item => { item.open = openBeforePrint.includes(item); });
      openBeforePrint = [];
    });
  }

  document.addEventListener("DOMContentLoaded", render);
})();
