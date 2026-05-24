/**
 * App Controller - Guia de Estudos Definitivo POO Java
 * Full rewrite with mobile nav, exercise filters, quiz shuffle,
 * revision mode, cheatsheet page, glossary, and improved UX.
 */

class App {
  constructor() {
    this.state = {
      currentSection: 'dashboard',
      currentTab: 'learn',
      currentConceptIndex: 0,
      completedConcepts: [],
      completedChallenges: [],
      
      // Exam (Simulado)
      exam: {
        active: false,
        questions: [],
        answers: {}, // index -> selectedOption index
        flagged: {}, // index -> boolean
        currentIdx: 0,
        timeRemaining: 1800, // 30 minutes in seconds
        timerInterval: null,
        history: [] // array of attempt results: { score, total, pct, timeSpent, date }
      },
      
      // Study helpers
      currentFlashcardIndex: 0,
      flashcardFlipped: false,

      // Exercises
      completedExercises: [],
      currentExerciseIndex: 0,
      exerciseFilter: 'all',
      exerciseDiffFilter: null,
      exerciseSidebarOpen: window.innerWidth > 1023,
      filteredExercises: [],

      // Mobile
      sidebarOpen: false
    };
  }

  init() {
    this.loadState();
    this.renderSidebarConcepts();
    this.renderDashboard();
    this.updateGlobalProgressBar();
    this.renderFlashcard();
    
    // Initialize filtered exercises
    this.state.filteredExercises = this.getFilteredExercises();
    
    lucide.createIcons();
    this.setupMemoryHoverEffects();
    
    // Handle window resize for responsive behavior
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1023) {
        this.closeSidebar();
      }
    });
  }

  // ========================================
  // STATE MANAGEMENT
  // ========================================
  loadState() {
    const saved = localStorage.getItem('java_poo_study_guide_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.state.completedConcepts = parsed.completedConcepts || [];
        this.state.completedChallenges = parsed.completedChallenges || [];
        this.state.completedExercises = parsed.completedExercises || [];
        this.state.exam.history = parsed.examHistory || [];
      } catch (e) {
        console.error("Error loading state:", e);
      }
    } else {
      // Try migrating from v1
      const v1 = localStorage.getItem('java_poo_study_guide_state');
      if (v1) {
        try {
          const parsed = JSON.parse(v1);
          this.state.completedConcepts = parsed.completedConcepts || [];
          this.state.completedChallenges = parsed.completedChallenges || [];
          this.state.completedExercises = parsed.completedExercises || [];
          this.state.exam.history = parsed.examHistory || [];
          this.saveState();
        } catch (e) {}
      }
    }
  }

  saveState() {
    const data = {
      completedConcepts: this.state.completedConcepts,
      completedChallenges: this.state.completedChallenges,
      completedExercises: this.state.completedExercises,
      examHistory: this.state.exam.history
    };
    localStorage.setItem('java_poo_study_guide_v2', JSON.stringify(data));
    this.updateGlobalProgressBar();
    this.renderDashboard();
    this.renderSidebarConcepts();
  }

  // ========================================
  // MOBILE NAVIGATION
  // ========================================
  toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    if (sidebar.classList.contains('open')) {
      this.closeSidebar();
    } else {
      sidebar.classList.add('open');
      overlay.classList.add('show');
      this.state.sidebarOpen = true;
    }
  }

  closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
    this.state.sidebarOpen = false;
  }

  updateBottomNav(sectionId) {
    document.querySelectorAll('.bottom-nav-btn').forEach(btn => btn.classList.remove('active'));
    
    const mapping = {
      'dashboard': 'bnav-dashboard',
      'intro': 'bnav-concepts',
      'exercises': 'bnav-exercises',
      'exam': 'bnav-exam'
    };
    
    if (sectionId.startsWith('concept-')) {
      const el = document.getElementById('bnav-concepts');
      if (el) el.classList.add('active');
    } else if (mapping[sectionId]) {
      const el = document.getElementById(mapping[sectionId]);
      if (el) el.classList.add('active');
    }
  }

  // ========================================
  // SECTION ROUTING
  // ========================================
  switchSection(sectionId) {
    this.state.currentSection = sectionId;
    this.closeSidebar();
    
    document.querySelectorAll('.section-container').forEach(sec => sec.classList.remove('active'));
    
    let targetId = `section-${sectionId}`;
    if (sectionId.startsWith('concept-')) targetId = 'section-study';
    
    const targetSection = document.getElementById(targetId);
    if (targetSection) targetSection.classList.add('active');
    
    // Update sidebar active states
    document.querySelectorAll('.menu-btn').forEach(btn => btn.classList.remove('active'));
    const menuBtn = document.getElementById(`menu-btn-${sectionId}`);
    if (menuBtn) {
      menuBtn.classList.add('active');
    } else if (sectionId.startsWith('concept-')) {
      const conceptId = sectionId.replace('concept-', '');
      const conceptBtn = document.getElementById(`menu-btn-concept-${conceptId}`);
      if (conceptBtn) conceptBtn.classList.add('active');
    }
    
    this.updateBottomNav(sectionId);

    // Section-specific init
    if (sectionId === 'dashboard') {
      this.renderDashboard();
    } else if (sectionId === 'flashcards') {
      this.state.currentFlashcardIndex = 0;
      this.state.flashcardFlipped = false;
      this.renderFlashcard();
    } else if (sectionId === 'exam') {
      if (this.state.exam.active) {
        document.getElementById('exam-start-view').style.display = 'none';
        document.getElementById('exam-results-view').style.display = 'none';
        document.getElementById('exam-running-view').style.display = 'grid';
      } else {
        document.getElementById('exam-running-view').style.display = 'none';
        document.getElementById('exam-results-view').style.display = 'none';
        document.getElementById('exam-start-view').style.display = 'block';
        this.updateExamDashboardCard();
      }
    } else if (sectionId === 'exercises') {
      this.state.filteredExercises = this.getFilteredExercises();
      this.renderExercisesList();
      
      // Toggle CSS classes based on sidebar state
      const sidebar = document.getElementById('exercises-sidebar');
      const layout = document.getElementById('exercises-layout');
      if (sidebar && layout) {
        sidebar.classList.toggle('collapsed', !this.state.exerciseSidebarOpen);
        layout.classList.toggle('sidebar-collapsed', !this.state.exerciseSidebarOpen);
      }
      
      if (this.state.filteredExercises.length > 0) {
        this.loadExerciseByGlobalIndex(this.state.filteredExercises[0]._globalIndex);
      }
    } else if (sectionId === 'revision') {
      this.renderRevision();
    } else if (sectionId === 'cheatsheet') {
      this.renderCheatSheet();
    } else if (sectionId === 'glossary') {
      this.renderGlossary();
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    lucide.createIcons();
  }

  // ========================================
  // CONTINUE STUDYING
  // ========================================
  continueStudying() {
    const concepts = window.pooData.concepts;
    
    // Find first concept without theory read
    for (let i = 0; i < concepts.length; i++) {
      if (!this.state.completedConcepts.includes(concepts[i].id)) {
        this.loadConcept(concepts[i].id);
        return;
      }
    }
    
    // All theory read, find first without challenge done
    for (let i = 0; i < concepts.length; i++) {
      if (!this.state.completedChallenges.includes(concepts[i].id)) {
        this.loadConcept(concepts[i].id);
        return;
      }
    }
    
    // All done, go to exercises
    this.switchSection('exercises');
  }

  // ========================================
  // CONCEPT LOADING & THEORY
  // ========================================
  loadConcept(conceptId) {
    const index = window.pooData.concepts.findIndex(c => c.id === conceptId);
    if (index === -1) return;
    
    this.state.currentConceptIndex = index;
    const concept = window.pooData.concepts[index];
    
    document.getElementById('current-concept-title').innerText = concept.title;
    document.getElementById('current-concept-summary').innerText = concept.summary;
    
    document.getElementById('lesson-theory-body').innerHTML = concept.theory;
    this.renderMemoryModel(concept);
    
    const editor = document.getElementById('code-editor');
    editor.value = concept.challenge.initialCode;
    this.updateLineNumbers();
    
    const terminal = document.getElementById('terminal-output');
    terminal.innerHTML = `
      <div class="terminal-line"><span class="terminal-input-indicator">></span> javac POOChallenge.java</div>
      <div class="terminal-line" style="color:var(--text-muted);">Pronto para compilação. Clique em "Compilar" para testar.</div>
    `;
    
    // Update completion card and button dynamically
    const nextConcept = window.pooData.concepts[index + 1];
    const isCompleted = this.state.completedConcepts.includes(concept.id);
    
    const cardTitle = document.querySelector('.theory-completion-card h4');
    const cardDesc = document.querySelector('.theory-completion-card p');
    const btn = document.getElementById('btn-complete-theory');
    
    if (btn) {
      if (nextConcept) {
        if (isCompleted) {
          if (cardTitle) cardTitle.innerText = "Você já concluiu este conceito!";
          if (cardDesc) cardDesc.innerText = "Deseja avançar para o próximo tema da trilha?";
          btn.className = "btn btn-secondary";
          btn.innerHTML = '<span>Avançar para Próxima Lição</span> <i data-lucide="arrow-right"></i>';
        } else {
          if (cardTitle) cardTitle.innerText = "Finalizou a leitura da lição?";
          if (cardDesc) cardDesc.innerText = "Clique para concluir este conceito e avançar para o próximo.";
          btn.className = "btn btn-primary";
          btn.innerHTML = '<span>Concluir e Avançar</span> <i data-lucide="arrow-right"></i>';
        }
      } else {
        // Last concept
        if (isCompleted) {
          if (cardTitle) cardTitle.innerText = "Trilha teórica finalizada!";
          if (cardDesc) cardDesc.innerText = "Você já leu todos os conceitos. Pratique com exercícios!";
          btn.className = "btn btn-success";
          btn.innerHTML = '<span>Ir para Exercícios Extras</span> <i data-lucide="wrench"></i>';
        } else {
          if (cardTitle) cardTitle.innerText = "Você chegou ao fim da trilha teórica!";
          if (cardDesc) cardDesc.innerText = "Clique para concluir a lição final e abrir o banco de exercícios.";
          btn.className = "btn btn-primary";
          btn.innerHTML = '<span>Concluir e Ir para Prática</span> <i data-lucide="wrench"></i>';
        }
      }
    }
    
    this.switchTab('learn');
    this.switchSection(`concept-${conceptId}`);
  }

  completeAndNextConcept() {
    const concepts = window.pooData.concepts;
    const currentConcept = concepts[this.state.currentConceptIndex];
    if (!currentConcept) return;
    
    // Mark current as completed if not already
    if (!this.state.completedConcepts.includes(currentConcept.id)) {
      this.state.completedConcepts.push(currentConcept.id);
      this.saveState();
      this.showToast(`Conceito "${currentConcept.title}" concluído!`, 'success');
    }
    
    // Check if there is a next concept
    const nextConcept = concepts[this.state.currentConceptIndex + 1];
    if (nextConcept) {
      this.loadConcept(nextConcept.id);
    } else {
      // Last concept completed, go to exercises
      this.switchSection('exercises');
      this.showToast("Parabéns! Você concluiu toda a trilha teórica de POO! Pratique no banco de exercícios.", "success");
    }
  }

  resetProgress() {
    if (confirm("Tem certeza de que deseja resetar TODO o seu progresso?")) {
      this.state.completedConcepts = [];
      this.state.completedChallenges = [];
      this.state.completedExercises = [];
      this.state.exam.history = [];
      if (this.state.exam.timerInterval) {
        clearInterval(this.state.exam.timerInterval);
        this.state.exam.timerInterval = null;
      }
      this.state.exam.active = false;
      this.saveState();
      this.updateExamDashboardCard();
      this.showToast("Progresso resetado!", "success");
      
      if (this.state.currentSection.startsWith('concept-')) {
        const conceptId = this.state.currentSection.replace('concept-', '');
        this.loadConcept(conceptId);
      } else if (this.state.currentSection === 'exercises') {
        this.state.filteredExercises = this.getFilteredExercises();
        this.renderExercisesList();
        if (this.state.filteredExercises.length > 0) this.loadExerciseByGlobalIndex(0);
      } else {
        this.renderDashboard();
      }
      this.updateGlobalProgressBar();
      this.renderSidebarConcepts();
    }
  }

  // ========================================
  // TABS (Learn / Practice)
  // ========================================
  switchTab(tabId) {
    this.state.currentTab = tabId;
    
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`tab-btn-${tabId}`).classList.add('active');
    
    const learn = document.getElementById('tab-content-learn');
    const practice = document.getElementById('tab-content-practice');
    
    if (tabId === 'learn') {
      learn.style.display = 'grid';
      practice.style.display = 'none';
      const concept = window.pooData.concepts[this.state.currentConceptIndex];
      this.renderMemoryModel(concept);
    } else {
      learn.style.display = 'none';
      practice.style.display = 'block';
      this.updateLineNumbers();
    }
    lucide.createIcons();
  }

  // ========================================
  // MEMORY VISUALIZER
  // ========================================
  renderMemoryModel(concept) {
    const stackContainer = document.getElementById('stack-container');
    const heapContainer = document.getElementById('heap-container');
    const explanation = document.getElementById('visualizer-explanation');
    
    stackContainer.innerHTML = '';
    heapContainer.innerHTML = '';
    explanation.innerText = concept.memoryModel.description;
    
    if (concept.memoryModel.stack.length === 0) {
      stackContainer.innerHTML = '<div class="empty-memory-text">Pilha Vazia</div>';
    } else {
      concept.memoryModel.stack.forEach(variable => {
        const item = document.createElement('div');
        item.className = 'memory-item';
        const isRef = variable.value.startsWith('ref:');
        const displayVal = isRef ? variable.value.replace('ref: ', '') : variable.value;
        item.setAttribute('data-var-name', variable.name);
        if (isRef) {
          item.style.cursor = 'pointer';
          item.style.border = '1px solid rgba(99, 102, 241, 0.25)';
          item.innerHTML = `
            <div class="memory-item-title">${variable.name} →</div>
            <div class="memory-item-value" style="color:#a855f7;">${displayVal}</div>
          `;
        } else {
          item.innerHTML = `
            <div class="memory-item-title">${variable.name}</div>
            <div class="memory-item-value">${displayVal}</div>
          `;
        }
        stackContainer.appendChild(item);
      });
    }
    
    if (concept.memoryModel.heap.length === 0) {
      heapContainer.innerHTML = '<div class="empty-memory-text">Monte Vazio</div>';
    } else {
      concept.memoryModel.heap.forEach(obj => {
        const item = document.createElement('div');
        item.className = 'memory-item';
        item.id = `heap-obj-${obj.address.replace('@', '')}`;
        
        let fieldsHtml = '';
        for (const [key, val] of Object.entries(obj.fields)) {
          fieldsHtml += `<div class="memory-field"><strong>${key}:</strong> ${val}</div>`;
        }
        item.innerHTML = `
          <div class="memory-item-title" style="color:var(--success);">${obj.address} [${obj.type}]</div>
          <div>${fieldsHtml}</div>
        `;
        heapContainer.appendChild(item);
      });
    }
    
    lucide.createIcons();
    this.setupMemoryHoverEffects();
  }

  setupMemoryHoverEffects() {
    document.querySelectorAll('#stack-container .memory-item').forEach(item => {
      const textVal = item.querySelector('.memory-item-value')?.innerText;
      if (textVal && textVal.startsWith('@')) {
        const heapId = `heap-obj-${textVal.replace('@', '')}`;
        const heapObj = document.getElementById(heapId);
        if (heapObj) {
          item.addEventListener('mouseenter', () => {
            heapObj.style.borderColor = 'var(--primary)';
            heapObj.style.boxShadow = '0 0 12px rgba(99, 102, 241, 0.3)';
            item.style.borderColor = 'var(--primary)';
          });
          item.addEventListener('mouseleave', () => {
            heapObj.style.borderColor = 'var(--border-color)';
            heapObj.style.boxShadow = 'none';
            item.style.borderColor = 'var(--border-color)';
          });
        }
      }
    });
  }

  // ========================================
  // SIDEBAR CONCEPTS
  // ========================================
  renderSidebarConcepts() {
    const list = document.getElementById('sidebar-concepts-list');
    list.innerHTML = '';
    
    window.pooData.concepts.forEach(concept => {
      const isCompleted = this.state.completedChallenges.includes(concept.id);
      const isRead = this.state.completedConcepts.includes(concept.id);
      
      const btn = document.createElement('button');
      btn.className = `menu-btn ${isCompleted ? 'completed' : ''}`;
      btn.id = `menu-btn-concept-${concept.id}`;
      btn.onclick = () => this.loadConcept(concept.id);
      
      let statusHtml = '';
      if (isCompleted) {
        statusHtml = `<i data-lucide="check-circle-2" class="status-icon" style="margin-left:auto;width:14px;height:14px;"></i>`;
      } else if (isRead) {
        statusHtml = `<i data-lucide="circle-dot" class="status-icon" style="margin-left:auto;color:var(--primary);width:14px;height:14px;"></i>`;
      }
      
      btn.innerHTML = `
        <i data-lucide="${concept.icon}"></i>
        <span>${concept.title}</span>
        ${statusHtml}
      `;
      list.appendChild(btn);
    });
    
    lucide.createIcons();
  }

  // ========================================
  // DASHBOARD
  // ========================================
  renderDashboard() {
    const total = window.pooData.concepts.length;
    const readCount = this.state.completedConcepts.length;
    const challengeCount = this.state.completedChallenges.length;
    const exerciseCount = this.state.completedExercises.length;
    
    document.getElementById('stat-completed-lessons').innerText = `${readCount} / ${total}`;
    document.getElementById('stat-code-challenges').innerText = `${challengeCount} / ${total}`;
    document.getElementById('stat-exercises-done').innerText = `${exerciseCount}`;
    
    this.updateExamDashboardCard();
    
    // Continue studying button text
    const continueBtn = document.getElementById('btn-continue-studying');
    if (continueBtn) {
      const allRead = readCount >= total;
      const allChallenges = challengeCount >= total;
      if (allRead && allChallenges) {
        continueBtn.querySelector('span').innerText = 'Ir para Exercícios Extras';
      } else if (allRead) {
        continueBtn.querySelector('span').innerText = 'Continuar Desafios Práticos';
      } else {
        continueBtn.querySelector('span').innerText = 'Continuar Estudando';
      }
    }
    
    // Roadmap
    const roadmapGrid = document.getElementById('dashboard-roadmap-grid');
    roadmapGrid.innerHTML = '';
    
    window.pooData.concepts.forEach((concept, index) => {
      const challengeDone = this.state.completedChallenges.includes(concept.id);
      const theoryRead = this.state.completedConcepts.includes(concept.id);
      
      let stepClass = '';
      let badgeHtml = '';
      
      if (challengeDone) {
        stepClass = 'completed';
        badgeHtml = `<span class="roadmap-status-badge badge-completed"><i data-lucide="check"></i> Concluído</span>`;
      } else if (theoryRead) {
        stepClass = 'active-step';
        badgeHtml = `<span class="roadmap-status-badge badge-ready"><i data-lucide="play"></i> Desafio Pronto</span>`;
      } else {
        const isFirst = index === 0;
        const prevDone = isFirst || this.state.completedChallenges.includes(window.pooData.concepts[index - 1].id);
        
        if (prevDone) {
          stepClass = 'active-step';
          badgeHtml = `<span class="roadmap-status-badge badge-ready"><i data-lucide="book-open"></i> Disponível</span>`;
        } else {
          stepClass = 'locked';
          badgeHtml = `<span class="roadmap-status-badge badge-locked"><i data-lucide="lock"></i> Bloqueado</span>`;
        }
      }
      
      const card = document.createElement('div');
      card.className = `roadmap-card ${stepClass}`;
      card.onclick = () => {
        if (stepClass !== 'locked') this.loadConcept(concept.id);
        else this.showToast('Conclua os desafios anteriores para desbloquear!', 'warning');
      };
      card.innerHTML = `
        <div class="card-step-num">0${index + 1}</div>
        <div class="roadmap-card-header">
          <div class="roadmap-card-icon"><i data-lucide="${concept.icon}"></i></div>
          <h4>${concept.title}</h4>
        </div>
        <p>${concept.summary}</p>
        ${badgeHtml}
      `;
      roadmapGrid.appendChild(card);
    });
    
    lucide.createIcons();
  }

  updateGlobalProgressBar() {
    const total = window.pooData.concepts.length * 2;
    const current = this.state.completedConcepts.length + this.state.completedChallenges.length;
    const pct = total > 0 ? (current / total) * 100 : 0;
    
    const bar = document.getElementById('global-progress-bar');
    const text = document.getElementById('global-progress-percent');
    if (bar) bar.style.width = `${pct}%`;
    if (text) text.innerText = `${Math.round(pct)}%`;
  }

  // ========================================
  // CODE EDITOR (Concept challenges)
  // ========================================
  updateLineNumbers() {
    const textarea = document.getElementById('code-editor');
    const container = document.getElementById('editor-line-numbers');
    if (!textarea || !container) return;
    const lines = textarea.value.split('\n');
    container.innerHTML = lines.map((_, i) => `<div>${i + 1}</div>`).join('');
  }

  runCodeCompiler() {
    const concept = window.pooData.concepts[this.state.currentConceptIndex];
    const userCode = document.getElementById('code-editor').value;
    const terminal = document.getElementById('terminal-output');
    const spinner = document.getElementById('compiler-spinner');
    const btn = document.getElementById('btn-compile-run');
    
    btn.disabled = true;
    spinner.style.display = 'block';
    terminal.innerHTML = `
      <div class="terminal-line"><span class="terminal-input-indicator">></span> javac POOChallenge.java</div>
      <div class="terminal-line" style="color:var(--text-muted);">Analisando código...</div>
    `;
    
    setTimeout(() => {
      spinner.style.display = 'none';
      btn.disabled = false;
      
      const isValid = concept.challenge.validationRegex.test(userCode);
      
      if (isValid) {
        terminal.innerHTML = `
          <div class="terminal-line"><span class="terminal-input-indicator">></span> javac POOChallenge.java</div>
          <div class="terminal-line" style="color:var(--success);">[SUCCESS] Compilação bem-sucedida!</div>
          <div class="terminal-line"><span class="terminal-input-indicator">></span> java Teste</div>
          <div class="terminal-line" style="color:#fff;font-weight:bold;background:rgba(16,185,129,0.05);padding:8px;border-radius:4px;border-left:3px solid var(--success);margin-top:4px;">
Saída: Compilado e executado com sucesso! ✅
          </div>
        `;
        
        if (!this.state.completedChallenges.includes(concept.id)) {
          this.state.completedChallenges.push(concept.id);
          this.saveState();
        }
        this.showToast(`Desafio "${concept.title}" concluído!`, 'success');
        
        btn.className = "btn btn-success";
        btn.innerHTML = '<i data-lucide="check"></i> <span>Concluído!</span>';
        lucide.createIcons();
        setTimeout(() => {
          btn.className = "btn btn-primary";
          btn.innerHTML = '<i data-lucide="play"></i> <span>Compilar</span>';
          lucide.createIcons();
        }, 3000);
      } else {
        terminal.innerHTML = `
          <div class="terminal-line"><span class="terminal-input-indicator">></span> javac POOChallenge.java</div>
          <div class="terminal-line terminal-error-text">[ERROR] Falha na compilação.</div>
          <div class="terminal-line" style="color:var(--danger);font-family:var(--font-mono);margin-top:8px;white-space:pre-wrap;">${concept.challenge.errorSimulated}</div>
          <div class="terminal-line" style="color:var(--text-muted);font-size:0.75rem;margin-top:8px;">Clique em "Dica" para uma sugestão de correção.</div>
        `;
        this.showToast('Erro de compilação! Revise o código.', 'error');
      }
      terminal.scrollTop = terminal.scrollHeight;
    }, 1000);
  }

  showChallengeHint() {
    const concept = window.pooData.concepts[this.state.currentConceptIndex];
    const terminal = document.getElementById('terminal-output');
    const hint = document.createElement('div');
    hint.className = 'terminal-line';
    hint.style.cssText = 'color:var(--warning);margin-top:6px;padding:8px;background:rgba(245,158,11,0.04);border-left:3px solid var(--warning);';
    hint.innerHTML = `<strong>Dica:</strong> ${concept.challenge.hint}`;
    terminal.appendChild(hint);
    terminal.scrollTop = terminal.scrollHeight;
    this.showToast('Dica exibida no console!', 'warning');
  }



  // ========================================
  // TOAST
  // ========================================
  showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const msg = document.getElementById('toast-message');
    
    toast.className = `toast ${type}`;
    msg.innerText = message;
    
    const icon = toast.querySelector('i');
    const icons = { success: 'check-circle-2', error: 'x-circle', warning: 'alert-triangle' };
    icon.setAttribute('data-lucide', icons[type] || 'check-circle-2');
    lucide.createIcons();
    
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }

  // ========================================
  // SIMULADO / AVALIAÇÃO GERAL
  // ========================================
  startExam() {
    if (this.state.exam.timerInterval) {
      clearInterval(this.state.exam.timerInterval);
    }

    this.state.exam.active = true;
    this.state.exam.answers = {};
    this.state.exam.flagged = {};
    this.state.exam.currentIdx = 0;
    this.state.exam.timeRemaining = 1800; // 30 minutes

    const originalQuestions = window.pooData.quiz || [];
    const questions = [...originalQuestions];
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }
    this.state.exam.questions = questions;

    document.getElementById('exam-start-view').style.display = 'none';
    document.getElementById('exam-results-view').style.display = 'none';
    document.getElementById('exam-running-view').style.display = 'grid';

    this.state.exam.timerInterval = setInterval(() => {
      this.state.exam.timeRemaining--;
      this.updateExamTimer();

      if (this.state.exam.timeRemaining <= 0) {
        clearInterval(this.state.exam.timerInterval);
        this.state.exam.timerInterval = null;
        this.showToast('Tempo limite esgotado! Enviando respostas automaticamente...', 'warning');
        this.submitExam(true);
      }
    }, 1000);

    this.updateExamTimer();
    this.renderExamQuestion();
    this.renderExamNavGrid();
  }

  updateExamTimer() {
    const display = document.getElementById('exam-timer-display');
    if (!display) return;

    const mins = Math.floor(this.state.exam.timeRemaining / 60);
    const secs = this.state.exam.timeRemaining % 60;
    display.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    if (this.state.exam.timeRemaining < 300) {
      display.classList.add('warning');
    } else {
      display.classList.remove('warning');
    }
  }

  renderExamQuestion() {
    const qIndex = this.state.exam.currentIdx;
    const questions = this.state.exam.questions;
    const question = questions[qIndex];
    if (!question) return;

    document.getElementById('exam-question-number').innerText = `Questão ${qIndex + 1} de ${questions.length}`;
    document.getElementById('exam-question-counter').innerText = `${qIndex + 1} / ${questions.length}`;
    document.getElementById('exam-question-text').innerText = question.question;

    const container = document.getElementById('exam-options-container');
    container.innerHTML = '';

    const letters = ['A', 'B', 'C', 'D', 'E'];
    question.options.forEach((optionText, idx) => {
      const btn = document.createElement('button');
      btn.className = 'exam-option-btn';
      if (this.state.exam.answers[qIndex] === idx) {
        btn.classList.add('selected');
      }
      btn.onclick = () => this.selectExamOption(idx);

      btn.innerHTML = `
        <span class="exam-option-letter">${letters[idx]}</span>
        <span class="exam-option-text">${this.escapeHtml(optionText)}</span>
      `;
      container.appendChild(btn);
    });

    const flagBtn = document.getElementById('btn-exam-flag');
    if (flagBtn) {
      if (this.state.exam.flagged[qIndex]) {
        flagBtn.classList.add('active');
        flagBtn.querySelector('i').setAttribute('data-lucide', 'flag-off');
      } else {
        flagBtn.classList.remove('active');
        flagBtn.querySelector('i').setAttribute('data-lucide', 'flag');
      }
      lucide.createIcons();
    }

    document.getElementById('btn-exam-prev').disabled = qIndex === 0;
    document.getElementById('btn-exam-next').disabled = qIndex === questions.length - 1;
  }

  selectExamOption(optionIdx) {
    const qIndex = this.state.exam.currentIdx;
    this.state.exam.answers[qIndex] = optionIdx;
    this.renderExamQuestion();
    this.renderExamNavGrid();
  }

  toggleExamFlag() {
    const qIndex = this.state.exam.currentIdx;
    this.state.exam.flagged[qIndex] = !this.state.exam.flagged[qIndex];
    this.renderExamQuestion();
    this.renderExamNavGrid();
  }

  navigateExam(direction) {
    if (direction === 'prev' && this.state.exam.currentIdx > 0) {
      this.state.exam.currentIdx--;
    } else if (direction === 'next' && this.state.exam.currentIdx < this.state.exam.questions.length - 1) {
      this.state.exam.currentIdx++;
    } else if (typeof direction === 'number') {
      this.state.exam.currentIdx = direction;
    }
    this.renderExamQuestion();
    this.renderExamNavGrid();
  }

  renderExamNavGrid() {
    const container = document.getElementById('exam-nav-grid-container');
    if (!container) return;
    container.innerHTML = '';

    const questions = this.state.exam.questions;
    questions.forEach((_, idx) => {
      const cell = document.createElement('button');
      cell.className = 'exam-nav-cell';
      cell.innerText = idx + 1;
      cell.onclick = () => this.navigateExam(idx);

      if (idx === this.state.exam.currentIdx) {
        cell.classList.add('active');
      }
      if (this.state.exam.answers[idx] !== undefined) {
        cell.classList.add('answered');
      }
      if (this.state.exam.flagged[idx]) {
        cell.classList.add('flagged');
      }

      container.appendChild(cell);
    });
  }

  confirmSubmitExam() {
    const total = this.state.exam.questions.length;
    const answeredCount = Object.keys(this.state.exam.answers).length;
    const unanswered = total - answeredCount;

    let msg = `Tem certeza de que deseja finalizar o simulado?\n\nRespondidas: ${answeredCount} / ${total}`;
    if (unanswered > 0) {
      msg += `\n⚠️ ATENÇÃO: Você deixou ${unanswered} questão(ões) sem resposta!`;
    }

    if (confirm(msg)) {
      this.submitExam();
    }
  }

  submitExam(auto = false) {
    if (this.state.exam.timerInterval) {
      clearInterval(this.state.exam.timerInterval);
      this.state.exam.timerInterval = null;
    }

    this.state.exam.active = false;

    const questions = this.state.exam.questions;
    let score = 0;
    const timeSpentSeconds = 1800 - this.state.exam.timeRemaining;

    const questionCategoryMap = {
      1: "Classes e Objetos",
      2: "Classes e Objetos",
      3: "Atributos e Métodos",
      4: "Herança e Associação",
      5: "Herança e Associação",
      6: "Herança e Associação",
      7: "Encapsulamento e Visibilidade",
      8: "Polimorfismo",
      9: "Polimorfismo",
      10: "Classes e Objetos",
      11: "Atributos e Métodos",
      12: "Polimorfismo",
      13: "Classes e Objetos",
      14: "Classes e Objetos",
      15: "Atributos e Métodos",
      16: "Herança e Associação",
      17: "Herança e Associação",
      18: "Polimorfismo"
    };

    const categories = {
      "Classes e Objetos": { correct: 0, total: 0 },
      "Atributos e Métodos": { correct: 0, total: 0 },
      "Encapsulamento e Visibilidade": { correct: 0, total: 0 },
      "Herança e Associação": { correct: 0, total: 0 },
      "Polimorfismo": { correct: 0, total: 0 }
    };

    questions.forEach((q, idx) => {
      const cat = questionCategoryMap[q.id] || "Outros";
      if (!categories[cat]) {
        categories[cat] = { correct: 0, total: 0 };
      }
      categories[cat].total++;

      const selected = this.state.exam.answers[idx];
      if (selected === q.correctIndex) {
        score++;
        categories[cat].correct++;
      }
    });

    const pct = Math.round((score / questions.length) * 100);

    const mins = Math.floor(timeSpentSeconds / 60);
    const secs = timeSpentSeconds % 60;
    const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    const result = {
      score,
      total: questions.length,
      pct,
      timeSpent: timeStr,
      categories,
      date: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    this.state.exam.history.push(result);
    this.saveState();

    this.renderExamResults(result);
    this.updateExamDashboardCard();

    document.getElementById('exam-running-view').style.display = 'none';
    document.getElementById('exam-start-view').style.display = 'none';
    document.getElementById('exam-results-view').style.display = 'block';
  }

  renderExamResults(result) {
    const scoreValEl = document.getElementById('exam-results-score-value');
    const scorePctEl = document.getElementById('exam-results-pct');
    const circle = document.getElementById('exam-results-circle');

    scoreValEl.innerText = `${result.score}/${result.total}`;
    scorePctEl.innerText = `${result.pct}% Acertos`;

    circle.className = 'results-circle-outer';
    if (result.pct >= 70) {
      circle.classList.add('success-border');
    } else if (result.pct >= 50) {
      circle.classList.add('warning-border');
    } else {
      circle.classList.add('danger-border');
    }

    const titleEl = document.getElementById('exam-results-title');
    const descEl = document.getElementById('exam-results-desc');
    if (result.pct === 100) {
      titleEl.innerText = "Desempenho Perfeito! 👑";
      descEl.innerText = "Gabaritou o simulado! Parabéns, seu domínio sobre os conceitos de Programação Orientada a Objetos em Java está em nível profissional. Você está plenamente preparado para qualquer prova ou entrevista.";
    } else if (result.pct >= 70) {
      titleEl.innerText = "Excelente Resultado! 🎯";
      descEl.innerText = "Você obteve um ótimo índice de acertos e demonstra sólida compreensão dos fundamentos. Confira a análise por tópicos abaixo para ajustar os pontos em que errou e garantir nota máxima!";
    } else if (result.pct >= 50) {
      titleEl.innerText = "Aprovado com Ressalvas! 📈";
      descEl.innerText = "Você atingiu a pontuação mínima de aprovação, mas ainda possui lacunas importantes em conceitos-chave de POO. Recomendamos revisar atentamente os gabaritos comentados das questões incorretas.";
    } else {
      titleEl.innerText = "Abaixo da Média! 📚";
      descEl.innerText = "Seu aproveitamento indica que você precisa reforçar as bases conceituais do paradigma orientado a objetos. Não desanime! Revise a trilha teórica dos tópicos indicados em vermelho e refaça a avaliação.";
    }

    document.getElementById('exam-results-time').innerText = result.timeSpent;
    document.getElementById('exam-results-date').innerText = result.date;

    const catContainer = document.getElementById('exam-category-stats-container');
    catContainer.innerHTML = '';

    Object.keys(result.categories).forEach(catName => {
      const cat = result.categories[catName];
      const catPct = cat.total > 0 ? Math.round((cat.correct / cat.total) * 100) : 0;

      const itemCard = document.createElement('div');
      itemCard.className = 'category-item-card';

      let scoreClass = 'success';
      if (catPct < 50) scoreClass = 'danger';
      else if (catPct < 70) scoreClass = 'warning';

      itemCard.innerHTML = `
        <div class="category-item-header">
          <span class="category-item-title">${catName}</span>
          <span class="category-item-score ${scoreClass}">${cat.correct}/${cat.total} (${catPct}%)</span>
        </div>
        <div class="category-bar-outer">
          <div class="category-bar-inner ${scoreClass}" style="width: ${catPct}%"></div>
        </div>
      `;
      catContainer.appendChild(itemCard);
    });

    const reviewContainer = document.getElementById('exam-review-list-container');
    reviewContainer.innerHTML = '';

    const letters = ['A', 'B', 'C', 'D', 'E'];
    this.state.exam.questions.forEach((q, idx) => {
      const userSelected = this.state.exam.answers[idx];
      const isCorrect = userSelected === q.correctIndex;
      const isSkipped = userSelected === undefined;

      const item = document.createElement('div');
      item.className = 'review-item';

      let statusBadge = '';
      if (isCorrect) {
        statusBadge = '<span class="review-badge correct"><i data-lucide="check"></i> Correta</span>';
      } else if (isSkipped) {
        statusBadge = '<span class="review-badge skipped"><i data-lucide="minus"></i> Não Respondida</span>';
      } else {
        statusBadge = '<span class="review-badge wrong"><i data-lucide="x"></i> Incorreta</span>';
      }

      let optionsMarkup = '';
      q.options.forEach((optText, optIdx) => {
        let optClass = '';
        if (optIdx === q.correctIndex) {
          optClass = 'correct';
        } else if (optIdx === userSelected) {
          optClass = 'wrong';
        } else {
          optClass = 'normal';
        }

        optionsMarkup += `
          <div class="review-option ${optClass}">
            <span class="review-option-letter">${letters[optIdx]}</span>
            <span>${this.escapeHtml(optText)}</span>
          </div>
        `;
      });

      item.innerHTML = `
        <div class="review-item-header">
          <span style="font-weight:700; color:var(--text-secondary);">Questão ${idx + 1}</span>
          ${statusBadge}
        </div>
        <p class="review-question-text">${this.escapeHtml(q.question)}</p>
        <div class="review-options-list">
          ${optionsMarkup}
        </div>
        <div class="explanation-card" style="display:block; margin-top:10px; background:rgba(255,255,255,0.01);">
          <div class="explanation-title" style="margin-bottom:6px;">
            <i data-lucide="info" style="width:14px; height:14px; color:var(--success);"></i>
            <span style="font-size:0.85rem; font-weight:700; color:var(--text-secondary);">Explicação da Resposta</span>
          </div>
          <p style="font-size:0.85rem; color:var(--text-secondary); line-height:1.5;">${q.explanation}</p>
        </div>
      `;

      reviewContainer.appendChild(item);
    });

    lucide.createIcons();
  }

  updateExamDashboardCard() {
    const history = this.state.exam.history;
    const card = document.getElementById('exam-last-attempt-card');
    const scoreVal = document.getElementById('exam-last-score');
    const scorePct = document.getElementById('exam-last-pct');
    const scoreTime = document.getElementById('exam-last-time');
    const dashboardScore = document.getElementById('stat-exam-score');

    if (history && history.length > 0) {
      const last = history[history.length - 1];

      if (card) card.style.display = 'block';
      if (scoreVal) scoreVal.innerText = `${last.score} / ${last.total}`;
      if (scorePct) scorePct.innerText = `${last.pct}%`;
      if (scoreTime) scoreTime.innerText = last.timeSpent;

      const best = history.reduce((max, h) => h.pct > max ? h.pct : max, 0);
      if (dashboardScore) {
        dashboardScore.innerText = `${best}%`;
      }
    } else {
      if (card) card.style.display = 'none';
      if (dashboardScore) {
        dashboardScore.innerText = '-%';
      }
    }
  }



  // ========================================
  // FLASHCARDS
  // ========================================
  flipFlashcard() {
    const container = document.querySelector('.flashcard-container');
    if (container) {
      container.classList.toggle('flipped');
      this.state.flashcardFlipped = !this.state.flashcardFlipped;
    }
  }

  prevFlashcard(e) {
    if (e) e.stopPropagation();
    if (this.state.currentFlashcardIndex > 0) {
      this.state.currentFlashcardIndex--;
      this.state.flashcardFlipped = false;
      document.querySelector('.flashcard-container')?.classList.remove('flipped');
      setTimeout(() => this.renderFlashcard(), 150);
    }
  }

  nextFlashcard(e) {
    if (e) e.stopPropagation();
    const total = window.pooData.flashcards.length;
    if (this.state.currentFlashcardIndex < total - 1) {
      this.state.currentFlashcardIndex++;
      this.state.flashcardFlipped = false;
      document.querySelector('.flashcard-container')?.classList.remove('flipped');
      setTimeout(() => this.renderFlashcard(), 150);
    } else {
      this.showToast('Fim dos flashcards!', 'success');
    }
  }

  renderFlashcard() {
    const card = window.pooData.flashcards[this.state.currentFlashcardIndex];
    if (!card) return;
    document.getElementById('flashcard-front-text').innerText = card.front;
    document.getElementById('flashcard-back-text').innerHTML = card.back;
    document.getElementById('flashcards-counter').innerText = `Card ${this.state.currentFlashcardIndex + 1} de ${window.pooData.flashcards.length}`;
  }

  // ========================================
  // EXERCISES BANK (with filters & navigation)
  // ========================================
  getFilteredExercises() {
    let exercises = window.pooData.exercises || [];
    // Add global index for reference
    exercises = exercises.map((ex, idx) => ({ ...ex, _globalIndex: idx }));
    
    const filter = this.state.exerciseFilter;
    const diffFilter = this.state.exerciseDiffFilter;
    
    if (filter === 'pending') {
      exercises = exercises.filter(ex => !this.state.completedExercises.includes(ex.id));
    } else if (filter === 'solved') {
      exercises = exercises.filter(ex => this.state.completedExercises.includes(ex.id));
    }
    
    if (diffFilter) {
      exercises = exercises.filter(ex => ex.difficulty === diffFilter);
    }
    
    return exercises;
  }

  filterExercises(filter) {
    this.state.exerciseFilter = filter;
    this.state.filteredExercises = this.getFilteredExercises();
    
    document.querySelectorAll('#exercises-filter-bar .filter-chip').forEach(chip => {
      chip.classList.toggle('active', chip.getAttribute('data-filter') === filter);
    });
    
    this.renderExercisesList();
    if (this.state.filteredExercises.length > 0) {
      this.loadExerciseByGlobalIndex(this.state.filteredExercises[0]._globalIndex);
    }
  }

  filterByDifficulty(diff) {
    if (this.state.exerciseDiffFilter === diff) {
      this.state.exerciseDiffFilter = null; // toggle off
    } else {
      this.state.exerciseDiffFilter = diff;
    }
    this.state.filteredExercises = this.getFilteredExercises();
    
    document.querySelectorAll('#exercises-difficulty-filter .filter-chip').forEach(chip => {
      chip.classList.toggle('active', chip.getAttribute('data-diff') === this.state.exerciseDiffFilter);
    });
    
    this.renderExercisesList();
    if (this.state.filteredExercises.length > 0) {
      this.loadExerciseByGlobalIndex(this.state.filteredExercises[0]._globalIndex);
    }
  }

  toggleExercisesSidebar() {
    const sidebar = document.getElementById('exercises-sidebar');
    const layout = document.getElementById('exercises-layout');
    
    this.state.exerciseSidebarOpen = !this.state.exerciseSidebarOpen;
    
    if (this.state.exerciseSidebarOpen) {
      sidebar.classList.remove('collapsed');
      layout.classList.remove('sidebar-collapsed');
    } else {
      sidebar.classList.add('collapsed');
      layout.classList.add('sidebar-collapsed');
    }
  }

  renderExercisesList() {
    const container = document.getElementById('exercises-list-container');
    if (!container) return;
    container.innerHTML = '';
    
    const allExercises = window.pooData.exercises || [];
    const completed = this.state.completedExercises || [];
    const filtered = this.state.filteredExercises;
    
    document.getElementById('exercises-completed-count').innerText = `${completed.length} / ${allExercises.length}`;
    
    filtered.forEach((ex) => {
      const isSolved = completed.includes(ex.id);
      const isActive = this.state.currentExerciseIndex === ex._globalIndex;
      
      const item = document.createElement('div');
      item.className = `exercise-list-item ${isSolved ? 'solved' : ''} ${isActive ? 'active' : ''}`;
      item.onclick = () => this.loadExerciseByGlobalIndex(ex._globalIndex);
      
      let diffClass = '';
      if (ex.difficulty === 'Fácil') diffClass = 'difficulty-facil';
      else if (ex.difficulty === 'Médio') diffClass = 'difficulty-medio';
      else diffClass = 'difficulty-dificil';
      
      item.innerHTML = `
        <div class="ex-title">
          <span>${ex._globalIndex + 1}. ${ex.title}</span>
          ${isSolved ? '<i data-lucide="check-circle-2" style="width:12px;height:12px;color:var(--success);flex-shrink:0;"></i>' : ''}
        </div>
        <div class="ex-meta">
          <span class="diff-badge ${diffClass}">${ex.difficulty}</span>
          <span class="cat-badge">${ex.category}</span>
        </div>
      `;
      container.appendChild(item);
    });
    lucide.createIcons();
  }

  loadExerciseByGlobalIndex(globalIndex) {
    const exercises = window.pooData.exercises || [];
    const ex = exercises[globalIndex];
    if (!ex) return;
    
    this.state.currentExerciseIndex = globalIndex;
    
    // Close exercise list sidebar on mobile when an exercise is loaded to focus on the workspace
    if (window.innerWidth <= 1023 && this.state.exerciseSidebarOpen) {
      this.toggleExercisesSidebar();
    }
    
    // Highlight active in list
    document.querySelectorAll('.exercise-list-item').forEach(item => item.classList.remove('active'));
    const filtered = this.state.filteredExercises;
    const filteredIdx = filtered.findIndex(e => e._globalIndex === globalIndex);
    const items = document.querySelectorAll('.exercise-list-item');
    if (filteredIdx >= 0 && items[filteredIdx]) items[filteredIdx].classList.add('active');
    
    // Set info
    document.getElementById('exercise-title-label').innerText = ex.title;
    document.getElementById('exercise-instructions-label').innerText = ex.instructions;
    document.getElementById('exercise-counter').innerText = `${globalIndex + 1} / ${exercises.length}`;
    
    const badge = document.getElementById('exercise-difficulty-badge');
    badge.innerText = ex.difficulty;
    badge.className = 'diff-badge';
    if (ex.difficulty === 'Fácil') badge.classList.add('difficulty-facil');
    else if (ex.difficulty === 'Médio') badge.classList.add('difficulty-medio');
    else badge.classList.add('difficulty-dificil');
    
    // Load code
    const editor = document.getElementById('exercise-code-editor');
    editor.value = ex.initialCode;
    this.updateExerciseLineNumbers();
    
    // Reset terminal
    document.getElementById('exercise-terminal-output').innerHTML = `
      <div class="terminal-line"><span class="terminal-input-indicator">></span> javac POOExercise.java</div>
      <div class="terminal-line" style="color:var(--text-muted);">Pronto. Clique em "Compilar e Executar".</div>
    `;
    
    // Reset compile button
    const btn = document.getElementById('btn-exercise-compile');
    if (btn) {
      btn.className = "btn btn-primary";
      btn.innerHTML = '<i data-lucide="play"></i> <span>Compilar e Executar</span>';
      lucide.createIcons();
    }
  }

  prevExercise() {
    const exercises = window.pooData.exercises || [];
    if (this.state.currentExerciseIndex > 0) {
      this.loadExerciseByGlobalIndex(this.state.currentExerciseIndex - 1);
    }
  }

  nextExercise() {
    const exercises = window.pooData.exercises || [];
    if (this.state.currentExerciseIndex < exercises.length - 1) {
      this.loadExerciseByGlobalIndex(this.state.currentExerciseIndex + 1);
    }
  }

  restoreExerciseCode() {
    const ex = (window.pooData.exercises || [])[this.state.currentExerciseIndex];
    if (ex) {
      document.getElementById('exercise-code-editor').value = ex.initialCode;
      this.updateExerciseLineNumbers();
      this.showToast('Código original restaurado.', 'success');
    }
  }

  updateExerciseLineNumbers() {
    const textarea = document.getElementById('exercise-code-editor');
    const container = document.getElementById('exercise-line-numbers');
    if (!textarea || !container) return;
    const lines = textarea.value.split('\n');
    container.innerHTML = lines.map((_, i) => `<div>${i + 1}</div>`).join('');
  }

  showExerciseHint() {
    const ex = (window.pooData.exercises || [])[this.state.currentExerciseIndex];
    const terminal = document.getElementById('exercise-terminal-output');
    if (!ex || !terminal) return;
    
    const hint = document.createElement('div');
    hint.className = 'terminal-line';
    hint.style.cssText = 'color:var(--warning);margin-top:6px;padding:8px;background:rgba(245,158,11,0.04);border-left:3px solid var(--warning);';
    hint.innerHTML = `<strong>Dica:</strong> ${ex.hint}`;
    terminal.appendChild(hint);
    terminal.scrollTop = terminal.scrollHeight;
    this.showToast('Dica exibida no console!', 'warning');
  }

  runExerciseCompiler() {
    const ex = (window.pooData.exercises || [])[this.state.currentExerciseIndex];
    const userCode = document.getElementById('exercise-code-editor').value;
    const terminal = document.getElementById('exercise-terminal-output');
    const spinner = document.getElementById('exercise-compiler-spinner');
    const btn = document.getElementById('btn-exercise-compile');
    if (!ex) return;
    
    btn.disabled = true;
    spinner.style.display = 'block';
    terminal.innerHTML = `
      <div class="terminal-line"><span class="terminal-input-indicator">></span> javac POOExercise.java</div>
      <div class="terminal-line" style="color:var(--text-muted);">Analisando código...</div>
    `;
    
    setTimeout(() => {
      spinner.style.display = 'none';
      btn.disabled = false;
      
      const isValid = ex.validationRegex.test(userCode);
      
      if (isValid) {
        terminal.innerHTML = `
          <div class="terminal-line"><span class="terminal-input-indicator">></span> javac POOExercise.java</div>
          <div class="terminal-line" style="color:var(--success);">[SUCCESS] Compilação bem-sucedida!</div>
          <div class="terminal-line"><span class="terminal-input-indicator">></span> java Teste</div>
          <div class="terminal-line" style="color:#fff;font-weight:bold;background:rgba(16,185,129,0.05);padding:8px;border-radius:4px;border-left:3px solid var(--success);margin-top:4px;">
Saída: Exercício solucionado com sucesso! ✅
          </div>
        `;
        
        if (!this.state.completedExercises.includes(ex.id)) {
          this.state.completedExercises.push(ex.id);
          this.saveState();
        }
        this.renderExercisesList();
        this.showToast(`"${ex.title}" concluído!`, 'success');
        
        btn.className = "btn btn-success";
        btn.innerHTML = '<i data-lucide="check"></i> <span>Concluído!</span>';
        lucide.createIcons();
        setTimeout(() => {
          btn.className = "btn btn-primary";
          btn.innerHTML = '<i data-lucide="play"></i> <span>Compilar e Executar</span>';
          lucide.createIcons();
        }, 3000);
      } else {
        terminal.innerHTML = `
          <div class="terminal-line"><span class="terminal-input-indicator">></span> javac POOExercise.java</div>
          <div class="terminal-line terminal-error-text">[ERROR] Erro de compilação detectado.</div>
          <div class="terminal-line" style="color:var(--danger);font-family:var(--font-mono);margin-top:8px;white-space:pre-wrap;">${ex.errorSimulated}</div>
        `;
        this.showToast('Erro de compilação! Tente novamente.', 'error');
      }
      terminal.scrollTop = terminal.scrollHeight;
    }, 1000);
  }

  // ========================================
  // QUICK REVISION
  // ========================================
  renderRevision() {
    const grid = document.getElementById('revision-grid');
    if (!grid) return;
    grid.innerHTML = '';
    
    const cards = window.pooData.reviewCards || [];
    
    if (cards.length === 0) {
      // Fallback: generate from concepts
      window.pooData.concepts.forEach(concept => {
        const card = document.createElement('div');
        card.className = 'revision-card';
        card.innerHTML = `
          <div class="revision-card-header">
            <i data-lucide="${concept.icon}"></i>
            <h4>${concept.title}</h4>
          </div>
          <p style="color:var(--text-secondary);font-size:0.85rem;line-height:1.5;">${concept.summary}</p>
          <button class="btn btn-secondary btn-sm" style="margin-top:10px;" onclick="app.loadConcept('${concept.id}')">
            <i data-lucide="arrow-right"></i> Estudar
          </button>
        `;
        grid.appendChild(card);
      });
    } else {
      cards.forEach(rc => {
        const concept = window.pooData.concepts.find(c => c.id === rc.id);
        const icon = concept ? concept.icon : 'book';
        
        const card = document.createElement('div');
        card.className = 'revision-card';
        
        const pointsHtml = rc.keyPoints.map(p => `<li>${p}</li>`).join('');
        
        card.innerHTML = `
          <div class="revision-card-header">
            <i data-lucide="${icon}"></i>
            <h4>${rc.title}</h4>
          </div>
          <ul class="revision-points">${pointsHtml}</ul>
          ${rc.codeSnippet ? `<pre><code class="language-java">${this.escapeHtml(rc.codeSnippet)}</code></pre>` : ''}
          <button class="btn btn-secondary btn-sm" style="margin-top:8px;" onclick="app.loadConcept('${rc.id}')">
            <i data-lucide="arrow-right"></i> Estudar completo
          </button>
        `;
        grid.appendChild(card);
      });
    }
    
    lucide.createIcons();
  }

  // ========================================
  // CHEAT SHEET (Dedicated Page)
  // ========================================
  renderCheatSheet() {
    const grid = document.getElementById('cheatsheet-grid');
    if (!grid) return;
    grid.innerHTML = '';
    
    const sheets = [
      {
        title: "Declaração de Classe",
        icon: "box",
        code: `public class NomeDaClasse {\n    // atributos\n    // construtor\n    // métodos\n}`
      },
      {
        title: "Instanciação de Objeto",
        icon: "cpu",
        code: `NomeDaClasse obj = new NomeDaClasse();\nobj.metodo();`
      },
      {
        title: "Modificadores de Acesso",
        icon: "eye",
        code: `private String secreta;      // Só na classe\nString padrao;               // Mesmo pacote\nprotected int pontos;        // Pacote + subclasses\npublic boolean ativo;        // Qualquer lugar`
      },
      {
        title: "Construtores & super()",
        icon: "settings",
        code: `class Pai {\n    Pai(String nome) { ... }\n}\nclass Filho extends Pai {\n    Filho(String nome, int idade) {\n        super(nome); // OBRIGATÓRIO!\n        this.idade = idade;\n    }\n}`
      },
      {
        title: "Herança (extends)",
        icon: "git-fork",
        code: `class Animal { }\nclass Cachorro extends Animal {\n    // Herda tudo de Animal\n}\n// Java NÃO suporta herança múltipla de classes`
      },
      {
        title: "Polimorfismo (@Override)",
        icon: "shuffle",
        code: `class Animal {\n    void som() { println("..."); }\n}\nclass Gato extends Animal {\n    @Override\n    void som() { println("Miau!"); }\n}\nAnimal a = new Gato();\na.som(); // "Miau!" (ligação dinâmica)`
      },
      {
        title: "Encapsulamento (Getters/Setters)",
        icon: "lock",
        code: `class Conta {\n    private double saldo;\n    public double getSaldo() {\n        return this.saldo;\n    }\n    public void setSaldo(double s) {\n        if (s >= 0) this.saldo = s;\n    }\n}`
      },
      {
        title: "Associação (Composição)",
        icon: "link",
        code: `class Motor { void ligar() { ... } }\nclass Carro {\n    private Motor motor; // Composição\n    Carro() {\n        this.motor = new Motor(); // Criado junto\n    }\n}`
      },
      {
        title: "Interface (implements)",
        icon: "file-code-2",
        code: `interface Voavel {\n    void voar(); // Método abstrato\n}\nclass Passaro implements Voavel {\n    public void voar() {\n        println("Voando!");\n    }\n}`
      }
    ];
    
    sheets.forEach(sheet => {
      const card = document.createElement('div');
      card.className = 'cheatsheet-card';
      card.innerHTML = `
        <h4><i data-lucide="${sheet.icon}"></i> ${sheet.title}</h4>
        <pre><code class="language-java">${this.escapeHtml(sheet.code)}</code></pre>
      `;
      grid.appendChild(card);
    });
    
    lucide.createIcons();
  }

  // ========================================
  // GLOSSARY
  // ========================================
  renderGlossary(filter = '') {
    const grid = document.getElementById('glossary-grid');
    if (!grid) return;
    grid.innerHTML = '';
    
    let terms = window.pooData.glossary || [];
    
    if (terms.length === 0) {
      // Fallback glossary
      terms = [
        { term: "Classe", definition: "Molde ou blueprint que define atributos e métodos de objetos.", relatedConcept: "Classe" },
        { term: "Objeto", definition: "Instância concreta de uma classe, alocada na Heap.", relatedConcept: "Objeto" },
        { term: "Atributo", definition: "Variável de instância que armazena o estado do objeto.", relatedConcept: "Atributo" },
        { term: "Método", definition: "Bloco de código que define o comportamento do objeto.", relatedConcept: "Método" },
        { term: "Encapsulamento", definition: "Princípio de esconder dados internos usando private e expor via getters/setters.", relatedConcept: "Visibilidade" },
        { term: "Herança", definition: "Mecanismo que permite uma classe herdar membros de outra usando extends.", relatedConcept: "Herança" },
        { term: "Polimorfismo", definition: "Capacidade de um método se comportar de formas diferentes dependendo do objeto.", relatedConcept: "Polimorfismo" },
        { term: "Construtor", definition: "Método especial com mesmo nome da classe, sem tipo de retorno, chamado ao usar new.", relatedConcept: "Construtor" },
        { term: "new", definition: "Operador que aloca memória na Heap e invoca o construtor para criar um objeto.", relatedConcept: "Objeto" },
        { term: "this", definition: "Referência ao próprio objeto atual dentro de um método ou construtor.", relatedConcept: "Construtor" },
        { term: "super", definition: "Referência à superclasse. Usado para acessar membros do pai ou chamar super().", relatedConcept: "Herança" },
        { term: "extends", definition: "Palavra-chave para herança de classes. Ex: class Filho extends Pai.", relatedConcept: "Herança" },
        { term: "implements", definition: "Palavra-chave para implementar interfaces. Ex: class X implements Y.", relatedConcept: "Associação" },
        { term: "@Override", definition: "Anotação que indica sobrescrita de método da superclasse (segurança em compilação).", relatedConcept: "Polimorfismo" },
        { term: "private", definition: "Modificador: visível apenas dentro da própria classe.", relatedConcept: "Visibilidade" },
        { term: "public", definition: "Modificador: visível em qualquer lugar.", relatedConcept: "Visibilidade" },
        { term: "protected", definition: "Modificador: visível no pacote + subclasses.", relatedConcept: "Visibilidade" },
        { term: "Stack (Pilha)", definition: "Área de memória que armazena variáveis locais e referências de métodos em execução.", relatedConcept: "Objeto" },
        { term: "Heap (Monte)", definition: "Área de memória onde objetos instanciados são alocados dinamicamente.", relatedConcept: "Objeto" },
        { term: "NullPointerException", definition: "Exceção lançada ao tentar usar uma referência que aponta para null.", relatedConcept: "Objeto" },
        { term: "Composição", definition: "Associação forte: a parte não existe sem o todo. Ex: Motor dentro de Carro.", relatedConcept: "Associação" },
        { term: "Agregação", definition: "Associação fraca: a parte pode existir independente do todo.", relatedConcept: "Associação" },
        { term: "final", definition: "Impede reatribuição (variáveis), sobrescrita (métodos) ou herança (classes).", relatedConcept: "Atributo" },
        { term: "void", definition: "Tipo de retorno que indica que o método não retorna nenhum valor.", relatedConcept: "Método" },
        { term: "Sobrecarga (Overload)", definition: "Métodos com mesmo nome mas parâmetros diferentes na mesma classe.", relatedConcept: "Método" },
        { term: "Sobrescrita (Override)", definition: "Método da subclasse com mesma assinatura do pai. Polimorfismo dinâmico.", relatedConcept: "Polimorfismo" },
        { term: "Ligação Dinâmica", definition: "JVM decide qual versão do método executar em tempo de execução, baseado no objeto real.", relatedConcept: "Polimorfismo" },
        { term: "Metaspace", definition: "Área de memória onde as definições de classes são armazenadas pela JVM.", relatedConcept: "Classe" }
      ];
    }
    
    if (filter) {
      const lower = filter.toLowerCase();
      terms = terms.filter(t => 
        t.term.toLowerCase().includes(lower) || 
        t.definition.toLowerCase().includes(lower)
      );
    }
    
    terms.forEach(t => {
      const item = document.createElement('div');
      item.className = 'glossary-item';
      item.innerHTML = `
        <div class="glossary-term">${t.term}</div>
        <div class="glossary-definition">${t.definition}</div>
        <div class="glossary-concept">${t.relatedConcept}</div>
      `;
      grid.appendChild(item);
    });
  }

  filterGlossary(value) {
    this.renderGlossary(value);
  }

  // ========================================
  // EXPORT / IMPORT PROGRESS
  // ========================================
  exportProgress() {
    const data = {
      completedConcepts: this.state.completedConcepts,
      completedChallenges: this.state.completedChallenges,
      completedExercises: this.state.completedExercises,
      examHistory: this.state.exam.history
    };
    const b64 = btoa(JSON.stringify(data));
    
    // Use modern clipboard API
    if (navigator.clipboard) {
      navigator.clipboard.writeText(b64).then(() => {
        alert("Código de progresso copiado para a Área de Transferência!\n\nCódigo:\n" + b64);
        this.showToast('Progresso copiado!', 'success');
      }).catch(() => {
        prompt("Copie seu código de progresso:", b64);
      });
    } else {
      prompt("Copie seu código de progresso:", b64);
    }
  }

  importProgress() {
    const raw = prompt("Cole o código de progresso:");
    if (!raw) return;
    
    try {
      const parsed = JSON.parse(atob(raw.trim()));
      if (parsed.completedConcepts && parsed.completedChallenges) {
        this.state.completedConcepts = parsed.completedConcepts;
        this.state.completedChallenges = parsed.completedChallenges;
        this.state.completedExercises = parsed.completedExercises || [];
        this.state.exam.history = parsed.examHistory || [];
        this.saveState();
        this.showToast('Progresso importado!', 'success');
        this.renderDashboard();
        this.renderSidebarConcepts();
        this.updateGlobalProgressBar();
      } else {
        alert("Código inválido!");
      }
    } catch (e) {
      alert("Falha ao importar. Verifique o código.");
    }
  }

  // ========================================
  // UTILITIES
  // ========================================
  escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
  window.app.init();
});
