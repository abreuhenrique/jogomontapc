const itens = document.querySelectorAll('.item');
const slots = document.querySelectorAll('.slot');
const info = document.getElementById('info');

const descricoes = {
    'placa-mae': "🟦 Placa-Mãe: Base do computador. Conecta e integra todos os componentes.",
    'processador': "🧠 Processador (CPU): Cérebro do computador. Executa instruções e cálculos.",
    'memoria-ram': "⚡ Memória RAM: Memória temporária, rápida, que armazena dados em uso.",
    'hd': "💾 HD/SSD: Armazena arquivos, programas e o sistema operacional.",
    'fonte': "🔌 Fonte: Fornece energia elétrica para todos os componentes do computador.",
    'placa-video': "🎮 Placa de Vídeo (GPU): Processa gráficos e vídeos. Essencial para jogos e design."
};

let placaMaeInstalada = false;

// Clique nas peças para mostrar informações
itens.forEach(item => {
    item.addEventListener('click', () => {
        info.textContent = descricoes[item.id];
    });
    item.addEventListener('dragstart', dragStart);
});

// Gerenciar slots
slots.forEach(slot => {
    slot.addEventListener('dragover', dragOver);
    slot.addEventListener('dragleave', dragLeave);
    slot.addEventListener('drop', drop);
});

function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.id);
}

function dragOver(e) {
    const accept = this.getAttribute('data-accept');

    if (accept === 'placa-mae' || placaMaeInstalada) {
        e.preventDefault();
        this.classList.add('hovered');
    }
}

function dragLeave() {
    this.classList.remove('hovered');
}

function drop(e) {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    const item = document.getElementById(id);
    const accept = this.getAttribute('data-accept');

    this.classList.remove('hovered');

    // Regra: CPU e RAM só podem ser colocados depois da Placa-Mãe
    const subslot = (accept === 'processador' || accept === 'memoria-ram');

    if (!subslot && !placaMaeInstalada && accept !== 'placa-mae') {
        alert("⚠️ Instale a Placa-Mãe antes de adicionar outras peças!");
        return;
    }

    if (id === accept) {
        if (!this.classList.contains('filled')) {
            const clone = item.cloneNode(true);
            clone.setAttribute('draggable', false);
            clone.classList.add('instalado');
            clone.addEventListener('click', () => {
                info.textContent = descricoes[id];
            });

            this.appendChild(clone);
            this.classList.add('filled');
            info.textContent = "✔️ " + descricoes[id];

            if (id === 'placa-mae') {
                placaMaeInstalada = true;
                document.getElementById('subslots-placa-mae').style.display = 'flex';
            }
        } else {
            alert("⚠️ Este slot já está preenchido.");
        }
    } else {
        alert("❌ Peça incorreta para este slot! Tente novamente.");
    }
}

