// Banco de dados do Guia de Estudos POO Java
const pooData = {
  concepts: [
    {
      id: "classe",
      title: "Classe",
      icon: "box",
      summary: "O molde (blueprint) que define a estrutura e o comportamento de um grupo de objetos.",
      theory: `
        <h3>O que é uma Classe?</h3>
        <p>Uma <strong>Classe</strong> é a unidade fundamental de POO em Java. Pense nela como uma planta ou molde para construir casas. Ela define as características (atributos) e os comportamentos (métodos) que os objetos criados a partir dela terão.</p>
        
        <h3>Estrutura Básica</h3>
        <pre><code class="language-java">public class Carro {
    // Atributos (estado)
    String modelo;
    String cor;
    
    // Métodos (comportamento)
    void acelerar() {
        System.out.println("O carro está acelerando...");
    }
}</code></pre>

        <div class="tip-card">
            <strong>Dica de Prova:</strong> A classe em si não ocupa espaço na memória Heap para armazenar dados; ela apenas descreve como os dados serão estruturados. O espaço é alocado apenas quando criamos um <strong>Objeto</strong>.
        </div>
      `,
      memoryModel: {
        description: "A classe reside na Metaspace (Área de Métodos). Nenhuma instância foi criada na Heap ainda.",
        stack: [],
        heap: []
      },
      challenge: {
        instructions: "Corrija a declaração da classe abaixo. O programador tentou definir uma classe usando a sintaxe incorreta <code>def Carro {</code> (estilo Python/Groovy) e esqueceu de fechar a declaração corretamente. Ajuste para a sintaxe Java correta.",
        initialCode: `def Carro {
    String modelo;
    int ano;
    
    void buzinar() {
        System.out.println("Beep!");
    }
// Faltando fechar a classe`,
        correctCode: `class Carro {
    String modelo;
    int ano;
    
    void buzinar() {
        System.out.println("Beep!");
    }
}`,
        validationRegex: /class\s+Carro\s*\{[\s\S]*void\s+buzinar\s*\(\s*\)\s*\{[\s\S]*\}[\s\S]*\}/,
        hint: "Em Java, usamos a palavra-chave 'class' antes do nome da classe. Lembre-se de que cada bloco aberto '{' deve ter um correspondente fechado '}'.",
        errorSimulated: "error: class, interface, or enum expected\n  def Carro {\n  ^"
      }
    },
    {
      id: "objeto",
      title: "Objeto",
      icon: "cpu",
      summary: "Uma instância concreta de uma classe. Ocupa espaço real na memória heap.",
      theory: `
        <h3>O que é um Objeto?</h3>
        <p>Um <strong>Objeto</strong> é a concretização da classe. Se a classe é a planta de uma casa, o objeto é a casa física construída.</p>
        <p>Em Java, criamos um objeto usando o operador <code>new</code>. A variável criada não guarda o objeto diretamente, mas sim uma <strong>referência</strong> (um endereço de memória) que aponta para onde o objeto realmente reside na memória <strong>Heap</strong>.</p>
        
        <h3>Criação de Objetos</h3>
        <pre><code class="language-java">Carro meuCarro = new Carro(); // meuCarro guarda a referência</code></pre>
        
        <div class="warning-card">
            <strong>Atenção!</strong> Se você declarar uma variável de objeto e não instanciá-la (deixá-la como <code>null</code>), tentar acessar qualquer atributo ou método dela causará o famoso erro: <code>NullPointerException</code>.
        </div>
      `,
      memoryModel: {
        description: "A variável 'meuCarro' está na Stack e contém a referência (ex: @0x9f) que aponta para o Objeto Carro alocado na Heap.",
        stack: [
          { name: "meuCarro", value: "ref: @0x9f" }
        ],
        heap: [
          { address: "@0x9f", type: "Carro", fields: { modelo: "null", cor: "null" } }
        ]
      },
      challenge: {
        instructions: "O código abaixo compila, mas lança um <code>NullPointerException</code> em tempo de execução porque a variável <code>computador</code> foi declarada mas nunca instanciada antes de usarmos seu método. Corrija o código instanciando o objeto computador.",
        initialCode: `public class Teste {
    public static void main(String[] args) {
        Computador computador = null;
        computador.ligar();
    }
}`,
        correctCode: `public class Teste {
    public static void main(String[] args) {
        Computador computador = new Computador();
        computador.ligar();
    }
}`,
        validationRegex: /Computador\s+computador\s*=\s*new\s+Computador\s*\(\s*\)/,
        hint: "Substitua 'null' pela instanciação do objeto usando o operador 'new' seguido do construtor 'Computador()'.",
        errorSimulated: "Exception in thread \"main\" java.lang.NullPointerException: Cannot invoke \"Computador.ligar()\" because \"computador\" is null"
      }
    },
    {
      id: "atributo",
      title: "Atributo",
      icon: "tag",
      summary: "Variáveis definidas dentro de uma classe que armazenam o estado do objeto.",
      theory: `
        <h3>O que são Atributos?</h3>
        <p>Os <strong>Atributos</strong> (ou variáveis de instância) descrevem o estado de um objeto. Eles guardam os dados associados a cada instância de uma classe.</p>
        
        <h3>Atributo de Instância vs Variável Local</h3>
        <ul>
            <li><strong>Atributo de Instância:</strong> Declarado diretamente dentro da classe. Possui valor padrão caso não seja inicializado (ex: <code>0</code> para números, <code>false</code> para booleanos e <code>null</code> para referências).</li>
            <li><strong>Variável Local:</strong> Declarada dentro de um método. <strong>Não</strong> possui valor padrão e causa erro de compilação se for lida sem inicialização prévia.</li>
        </ul>
        
        <pre><code class="language-java">public class Conta {
    double saldo; // Atributo de Instância (inicia com 0.0)
    
    void depositar(double valor) {
        double novoSaldo = saldo + valor; // novoSaldo é variável local
    }
}</code></pre>
      `,
      memoryModel: {
        description: "O objeto Conta na Heap possui o atributo 'saldo' contendo 150.0. Cada instância da classe possui sua própria cópia de 'saldo'.",
        stack: [
          { name: "minhaConta", value: "ref: @0x3a" }
        ],
        heap: [
          { address: "@0x3a", type: "Conta", fields: { saldo: "150.0" } }
        ]
      },
      challenge: {
        instructions: "O código abaixo falha na compilação. A variável local <code>imposto</code> está sendo usada sem ser inicializada. Atribua o valor <code>0.15</code> à variável <code>imposto</code> na sua declaração.",
        initialCode: `public class CalculadoraFiscal {
    public static void main(String[] args) {
        double valorProduto = 100.0;
        double imposto; // Variável local não inicializada!
        double valorFinal = valorProduto + (valorProduto * imposto);
        System.out.println("Valor final: " + valorFinal);
    }
}`,
        correctCode: `public class CalculadoraFiscal {
    public static void main(String[] args) {
        double valorProduto = 100.0;
        double imposto = 0.15;
        double valorFinal = valorProduto + (valorProduto * imposto);
        System.out.println("Valor final: " + valorFinal);
    }
}`,
        validationRegex: /double\s+imposto\s*=\s*0\.15/,
        hint: "Variáveis locais de método devem ser explicitamente inicializadas antes do uso. Mude 'double imposto;' para 'double imposto = 0.15;'.",
        errorSimulated: "error: variable imposto might not have been initialized\n        double valorFinal = valorProduto + (valorProduto * imposto);\n                                                           ^"
      }
    },
    {
      id: "metodo",
      title: "Método",
      icon: "activity",
      summary: "Define os comportamentos da classe, manipula seus atributos e realiza operações.",
      theory: `
        <h3>O que são Métodos?</h3>
        <p>Um <strong>Método</strong> é um bloco de código que realiza uma ação ou processamento. Ele define o comportamento dos objetos.</p>
        
        <h3>Elementos da Assinatura</h3>
        <p>A assinatura de um método em Java é composta por:</p>
        <ol>
            <li><strong>Modificador de Visibilidade</strong> (opcional): ex: <code>public</code></li>
            <li><strong>Tipo de Retorno</strong>: ex: <code>void</code> (nenhum retorno) ou <code>int</code>, <code>String</code>, etc.</li>
            <li><strong>Nome do Método</strong></li>
            <li><strong>Parâmetros</strong>: lista de argumentos entre parênteses.</li>
        </ol>
        
        <pre><code class="language-java">public double somar(double a, double b) {
    return a + b; // Retorna um tipo compatível com double
}</code></pre>

        <div class="warning-card">
            <strong>Regra Crucial:</strong> Se o método declara que retorna um tipo diferente de <code>void</code>, ele <strong>obrigatoriamente</strong> precisa executar uma instrução <code>return</code> com um valor compatível antes de encerrar.
        </div>
      `,
      memoryModel: {
        description: "Quando um método é chamado, um frame de método (ex: somar) é empilhado na Stack contendo os parâmetros locais (a = 10, b = 5).",
        stack: [
          { name: "main() frame", value: "ativo" },
          { name: "somar(10.0, 5.0)", value: "a: 10.0, b: 5.0" }
        ],
        heap: []
      },
      challenge: {
        instructions: "O método <code>getPrecoComDesconto</code> afirma que retorna um <code>double</code>, mas o programador esqueceu de colocar a palavra-chave <code>return</code> no cálculo. Ajuste para retornar o valor calculado.",
        initialCode: `public class Produto {
    double preco = 50.0;
    
    public double getPrecoComDesconto() {
        preco * 0.9; // Erro: Não está retornando nada!
    }
}`,
        correctCode: `public class Produto {
    double preco = 50.0;
    
    public double getPrecoComDesconto() {
        return preco * 0.9;
    }
}`,
        validationRegex: /return\s+preco\s*\*\s*0?\.9/,
        hint: "Adicione a palavra-chave 'return' antes da expressão 'preco * 0.9;'.",
        errorSimulated: "error: missing return statement\n    }\n    ^"
      }
    },
    {
      id: "visibilidade",
      title: "Modificadores de Visibilidade",
      icon: "eye",
      summary: "Controlam o nível de acesso que outras classes têm aos membros (atributos e métodos) de uma classe.",
      theory: `
        <h3>Os Modificadores em Java</h3>
        <p>São as palavras-chave que garantem o princípio do <strong>Encapsulamento</strong>:</p>
        <table>
            <thead>
                <tr>
                    <th>Modificador</th>
                    <th>Visível na própria Classe?</th>
                    <th>No mesmo Pacote (default)?</th>
                    <th>Em Subclasses? (Herança)</th>
                    <th>Em qualquer lugar (público)?</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>private</strong></td>
                    <td>Sim</td>
                    <td>Não</td>
                    <td>Não</td>
                    <td>Não</td>
                </tr>
                <tr>
                    <td><strong>default</strong> (sem palavra-chave)</td>
                    <td>Sim</td>
                    <td>Sim</td>
                    <td>Não (se fora do pct)</td>
                    <td>Não</td>
                </tr>
                <tr>
                    <td><strong>protected</strong></td>
                    <td>Sim</td>
                    <td>Sim</td>
                    <td>Sim</td>
                    <td>Não</td>
                </tr>
                <tr>
                    <td><strong>public</strong></td>
                    <td>Sim</td>
                    <td>Sim</td>
                    <td>Sim</td>
                    <td>Sim</td>
                </tr>
            </tbody>
        </table>

        <h3>Encapsulamento Clássico</h3>
        <pre><code class="language-java">public class Usuario {
    private String senha; // Ninguém fora da classe lê ou altera diretamente
    
    public String getSenha() {
        return this.senha; // Acesso controlado
    }
}</code></pre>
      `,
      memoryModel: {
        description: "O objeto Conta possui 'saldo' protegido como private. Nenhuma classe externa pode modificá-lo diretamente, apenas via método público depositar().",
        stack: [
          { name: "main()", value: "minhaConta.saldo = 1000 (Bloqueado!)" }
        ],
        heap: [
          { address: "@0xfa", type: "Conta", fields: { "[private] saldo": "150.0" } }
        ]
      },
      challenge: {
        instructions: "No código abaixo, a classe <code>Principal</code> está tentando acessar o atributo privado <code>saldo</code> de <code>Conta</code> diretamente, gerando um erro de compilação. Modifique a classe <code>Principal</code> para utilizar o método de encapsulamento correto <code>getSaldo()</code> para ler o saldo da conta.",
        initialCode: `class Conta {
    private double saldo = 250.0;
    
    public double getSaldo() {
        return this.saldo;
    }
}

public class Principal {
    public static void main(String[] args) {
        Conta conta = new Conta();
        // Erro de compilação: saldo é privado
        System.out.println("Saldo: " + conta.saldo);
    }
}`,
        correctCode: `class Conta {
    private double saldo = 250.0;
    
    public double getSaldo() {
        return this.saldo;
    }
}

public class Principal {
    public static void main(String[] args) {
        Conta conta = new Conta();
        System.out.println("Saldo: " + conta.getSaldo());
    }
}`,
        validationRegex: /conta\.getSaldo\(\)/,
        hint: "Substitua a chamada direta 'conta.saldo' pelo método getter público 'conta.getSaldo()'.",
        errorSimulated: "error: saldo has private access in Conta\n        System.out.println(\"Saldo: \" + conta.saldo);\n                                             ^"
      }
    },
    {
      id: "construtor",
      title: "Construtor",
      icon: "settings",
      summary: "Método especial chamado automaticamente no momento em que o objeto é instanciado na Heap.",
      theory: `
        <h3>O que é um Construtor?</h3>
        <p>O <strong>Construtor</strong> é utilizado para inicializar o estado de um novo objeto. Possui duas regras de sintaxe indispensáveis:</p>
        <ol>
            <li><strong>Tem o mesmo nome exato da classe</strong> (incluindo maiúsculas).</li>
            <li><strong>Não possui tipo de retorno</strong> (nem mesmo <code>void</code>).</li>
        </ol>

        <h3>Construtor Padrão vs Sobrecarga</h3>
        <p>Se você não criar nenhum construtor, o Java insere automaticamente um <strong>construtor padrão sem argumentos</strong>. Porém, se você definir qualquer construtor com parâmetros, o construtor padrão deixa de existir automaticamente.</p>
        <pre><code class="language-java">public class Livro {
    String titulo;
    
    // Construtor personalizado
    public Livro(String titulo) {
        this.titulo = titulo;
    }
}
// Agora, fazer "new Livro()" dará erro de compilação, você deve passar o título!</code></pre>
      `,
      memoryModel: {
        description: "Ao chamar 'new Livro(\"Java POO\")', o construtor é executado na Stack, inicializando o atributo titulo na Heap com a string informada.",
        stack: [
          { name: "Livro(String titulo)", value: "titulo: 'Java POO'" }
        ],
        heap: [
          { address: "@0x11b", type: "Livro", fields: { titulo: "'Java POO'" } }
        ]
      },
      challenge: {
        instructions: "O construtor da classe <code>Livro</code> foi declarado incorretamente como <code>void Livro(String titulo)</code>. Por ter <code>void</code>, ele virou um método comum e não inicializará o objeto na construção de forma padrão. Remova o <code>void</code> para corrigir a sintaxe do construtor.",
        initialCode: `public class Livro {
    String titulo;
    
    // Erro: Construtor não pode ter tipo de retorno!
    public void Livro(String titulo) {
        this.titulo = titulo;
    }
}`,
        correctCode: `public class Livro {
    String titulo;
    
    public Livro(String titulo) {
        this.titulo = titulo;
    }
}`,
        validationRegex: /public\s+Livro\s*\(\s*String\s+titulo\s*\)\s*\{/,
        hint: "Remova a palavra 'void' da linha da assinatura do construtor: 'public void Livro' deve ser 'public Livro'.",
        errorSimulated: "error: invalid method declaration; return type required\n    public void Livro(String titulo) {\n                ^"
      }
    },
    {
      id: "heranca",
      title: "Herança",
      icon: "git-fork",
      summary: "Permite que uma classe (subclasse) herde os atributos e métodos de outra (superclasse) com a palavra-chave extends.",
      theory: `
        <h3>O que é Herança?</h3>
        <p>A <strong>Herança</strong> modela uma relação do tipo <strong>"é um"</strong>. Uma subclasse estende uma superclasse, herdando todos os seus membros públicos e protegidos e permitindo reutilização de código.</p>
        <pre><code class="language-java">public class Veiculo {
    protected int velocidadeMaxima;
}

public class Moto extends Veiculo {
    // Moto herda velocidadeMaxima automaticamente!
}</code></pre>

        <h3>Regras Principais em Java:</h3>
        <ul>
            <li>Java <strong>não suporta herança múltipla de classes</strong>. Uma classe pode estender apenas uma classe pai (herança simples).</li>
            <li>Use a palavra-chave <code>super</code> para chamar atributos/métodos ou o construtor da superclasse.</li>
        </ul>
      `,
      memoryModel: {
        description: "O objeto Moto herda atributos da superclasse Veiculo. Ao chamar 'super', acessamos os dados herdados.",
        stack: [],
        heap: [
          { address: "@0xd4", type: "Moto (extends Veiculo)", fields: { velocidadeMaxima: "120", cilindradas: "150" } }
        ]
      },
      challenge: {
        instructions: "Java não aceita herança múltipla de classes usando vírgula (ex: <code>extends Veiculo, Motorizado</code>). Remova a herança múltipla fazendo a classe <code>Moto</code> estender apenas a classe base <code>Veiculo</code>.",
        initialCode: `class Veiculo {}
interface Motorizado {}

// Erro: Tentando estender classe e interface juntas com extends!
class Moto extends Veiculo, Motorizado {
    int cilindradas;
}`,
        correctCode: `class Veiculo {}
interface Motorizado {}

class Moto extends Veiculo {
    int cilindradas;
}`,
        validationRegex: /class\s+Moto\s+extends\s+Veiculo\s*\{/,
        hint: "Remova ', Motorizado' da declaração da classe. Se desejasse usar a interface, usaria a palavra-chave 'implements', mas aqui apenas estenda 'Veiculo'.",
        errorSimulated: "error: '{' expected\nclass Moto extends Veiculo, Motorizado {\n                          ^"
      }
    },
    {
      id: "associacao",
      title: "Associação",
      icon: "link",
      summary: "Uma relação estrutural onde um objeto possui ou utiliza a referência de outro objeto (relação 'tem um').",
      theory: `
        <h3>O que é Associação?</h3>
        <p>Associação define a relação <strong>"tem um"</strong> entre classes. Ela se divide em:</p>
        <ol>
            <li><strong>Associação Simples:</strong> Relação livre. Exemplo: <code>Paciente</code> e <code>Medico</code>.</li>
            <li><strong>Agregação:</strong> Relação de todo/parte onde a parte pode existir de forma independente. Exemplo: <code>Departamento</code> e <code>Professor</code> (se o departamento sumir, o professor ainda existe).</li>
            <li><strong>Composição:</strong> Relação de todo/parte forte, onde a parte não existe sem o todo. Exemplo: <code>Pedido</code> e <code>ItemPedido</code>, ou <code>Carro</code> e <code>Motor</code>.</li>
        </ol>

        <pre><code class="language-java">public class Carro {
    private Motor motor; // Associação do tipo Composição
    
    public Carro() {
        this.motor = new Motor(); // Criado junto com o Carro
    }
}</code></pre>
      `,
      memoryModel: {
        description: "O objeto Carro (@0x01) possui um atributo 'motor' que aponta para a referência @0x02 (outro objeto na Heap).",
        stack: [
          { name: "meuCarro", value: "ref: @0x01" }
        ],
        heap: [
          { address: "@0x01", type: "Carro", fields: { motor: "ref: @0x02" } },
          { address: "@0x02", type: "Motor", fields: { cavalos: "150" } }
        ]
      },
      challenge: {
        instructions: "O código de Composição abaixo lança <code>NullPointerException</code> porque ao instanciar o <code>Carro</code>, o programador declarou o atributo <code>motor</code>, mas esqueceu de inicializá-lo dentro do construtor do <code>Carro</code>. Inicialize o atributo <code>motor</code> usando <code>this.motor = new Motor();</code> dentro do construtor.",
        initialCode: `class Motor {
    void ligar() { System.out.println("Vrum!"); }
}

public class Carro {
    private Motor motor; // Atributo de associação
    
    public Carro() {
        // Esquecemos de inicializar o motor!
    }
    
    public void ligarCarro() {
        this.motor.ligar(); // Causa NullPointerException
    }
}`,
        correctCode: `class Motor {
    void ligar() { System.out.println("Vrum!"); }
}

public class Carro {
    private Motor motor;
    
    public Carro() {
        this.motor = new Motor();
    }
    
    public void ligarCarro() {
        this.motor.ligar();
    }
}`,
        validationRegex: /this\.motor\s*=\s*new\s+Motor\s*\(\s*\)/,
        hint: "Adicione a linha 'this.motor = new Motor();' dentro das chaves do construtor 'public Carro() { ... }'.",
        errorSimulated: "Exception in thread \"main\" java.lang.NullPointerException: Cannot invoke \"Motor.ligar()\" because \"this.motor\" is null"
      }
    },
    {
      id: "polimorfismo",
      title: "Polimorfismo",
      icon: "shuffle",
      summary: "Permite que um objeto seja tratado de várias formas. Em Java, a forma correta do método executado é decidida dinamicamente em tempo de execução.",
      theory: `
        <h3>O que é Polimorfismo?</h3>
        <p>A palavra <strong>Polimorfismo</strong> significa 'muitas formas'. Permite declarar uma variável de referência de uma superclasse e apontá-la para uma subclasse:</p>
        <pre><code class="language-java">Animal meuPet = new Cachorro();
meuPet.fazerBarulho(); // Executará o barulho do Cachorro, não do Animal!</code></pre>
        
        <h3>Sobrescrita de Método (@Override)</h3>
        <p>Para haver polimorfismo dinâmico em Java, a subclasse deve <strong>sobrescrever</strong> um método da superclasse mantendo a assinatura exata.</p>
        
        <div class="warning-card">
            <strong>Regra de Ouro da Prova:</strong> A referência (o tipo da variável) decide quais métodos você pode chamar <strong>em tempo de compilação</strong>. Já o objeto real (instanciado na Heap) decide qual versão do método será realmente executada <strong>em tempo de execução</strong>.
        </div>
      `,
      memoryModel: {
        description: "A variável 'animal' do tipo Animal (na Stack) aponta para um objeto Cachorro (na Heap). Ao chamar fazerSom(), a JVM desvia dinamicamente para o fazerSom() de Cachorro.",
        stack: [
          { name: "animal (Tipo: Animal)", value: "ref: @0xfa" }
        ],
        heap: [
          { address: "@0xfa", type: "Cachorro (subclasse de Animal)", fields: { raca: "'Labrador'" } }
        ]
      },
      challenge: {
        instructions: "O código abaixo tenta atribuir a referência de <code>Animal</code> a um objeto <code>Cachorro</code> e chamar o método <code>latir()</code>. Isso gera erro de compilação porque <code>latir()</code> não está declarado na superclasse <code>Animal</code>. Altere o tipo da variável <code>meuDog</code> na declaração para <code>Cachorro</code> para poder chamar o método específico.",
        initialCode: `class Animal {
    void emitirSom() { System.out.println("Som de animal"); }
}

class Cachorro extends Animal {
    void emitirSom() { System.out.println("Au Au!"); }
    void latir() { System.out.println("Woof!"); }
}

public class TestePolimorfismo {
    public static void main(String[] args) {
        Animal meuDog = new Cachorro(); // Referência da Superclasse
        meuDog.latir(); // Erro: Animal não possui método latir!
    }
}`,
        correctCode: `class Animal {
    void emitirSom() { System.out.println("Som de animal"); }
}

class Cachorro extends Animal {
    void emitirSom() { System.out.println("Au Au!"); }
    void latir() { System.out.println("Woof!"); }
}

public class TestePolimorfismo {
    public static void main(String[] args) {
        Cachorro meuDog = new Cachorro();
        meuDog.latir();
    }
}`,
        validationRegex: /Cachorro\s+meuDog\s*=\s*new\s+Cachorro\s*\(\s*\)/,
        hint: "Mude o tipo da variável meuDog de Animal para Cachorro na linha da declaração.",
        errorSimulated: "error: cannot find symbol\n  symbol:   method latir()\n  location: variable meuDog of type Animal"
      }
    }
  ],
  quiz: [
    {
      id: 1,
      question: "Qual das alternativas descreve corretamente a relação entre Classe e Objeto em termos de conceito e alocação de memória na JVM?",
      options: [
        "A classe reside na Heap e o objeto é instanciado diretamente na Stack.",
        "A classe é apenas o modelo (Metaspace/Área de Métodos) que não ocupa espaço para dados na Heap, enquanto o objeto é a instância física que consome espaço real na Heap para armazenar seus valores.",
        "Ambos residem na Stack de execução, porém o objeto é estático e a classe é dinâmica.",
        "A classe só consome memória Heap na primeira instanciação e, a partir da segunda, o objeto reaproveita a mesma área."
      ],
      correctIndex: 1,
      explanation: "Classes residem no Metaspace, que descreve a estrutura dos dados. Somente quando instanciamos o objeto (com 'new') é que memória Heap é de fato alocada para armazenar o estado desse objeto específico."
    },
    {
      id: 2,
      question: "Ao fazer 'Animal animal = new Cachorro();', qual a relação entre o tipo da variável de referência e o objeto real na Heap?",
      options: [
        "O tipo da referência determina o comportamento de compilação (métodos que podem ser chamados), enquanto o objeto real dita qual implementação de método será executada na JVM.",
        "O tipo da referência (Animal) é descartado imediatamente pela JVM e apenas Cachorro é mantido na memória.",
        "A referência obriga o objeto a ignorar os métodos da subclasse e executar apenas os métodos declarados na classe pai.",
        "O objeto na Heap é convertido fisicamente em Animal, perdendo seus atributos específicos de Cachorro."
      ],
      correctIndex: 0,
      explanation: "Esta é a Regra de Ouro do Polimorfismo: o tipo da referência (compilação) define o 'contrato' de quais métodos podem ser invocados, mas o objeto concreto na Heap (execução) define qual comportamento real será disparado via ligação dinâmica."
    },
    {
      id: 3,
      question: "Qual a principal diferença na inicialização e ciclo de vida entre atributos de instância e variáveis locais em Java?",
      options: [
        "Atributos são declarados em métodos e variáveis locais na classe.",
        "Atributos de instância são inicializados automaticamente com valores padrão (0, false, null) e duram enquanto o objeto viver na Heap, enquanto variáveis locais residem na Stack de frames do método e exigem inicialização explícita antes de serem lidas.",
        "Variáveis locais duram até o final da execução do programa, enquanto atributos são coletados pelo Garbage Collector a cada chamada de método.",
        "Ambos residem na Stack e são inicializados com valores padrão de forma idêntica."
      ],
      correctIndex: 1,
      explanation: "Campos de classe (atributos) são criados junto com o objeto na Heap e recebem valores padrões da JVM se não inicializados. Variáveis locais são alocadas no frame da Stack ao executar um método, e o Java exige que você as inicialize explicitamente para evitar lixo de memória."
    },
    {
      id: 4,
      question: "Sobre a tomada de decisão de design entre usar Herança ou Associação (Agregação/Composição), qual afirmativa é verdadeira sobre a relação entre os conceitos?",
      options: [
        "Herança modela uma relação fraca de dependência ('tem um'), enquanto a Associação modela uma relação forte de tipo ('é um').",
        "A Herança promove um acoplamento mais forte em tempo de compilação ('é um'), enquanto a Associação promove um acoplamento mais flexível em tempo de execução ('tem um').",
        "Não há diferença técnica entre os dois conceitos, sendo apenas escolhas de nomenclatura.",
        "Associação permite herdar métodos privados, enquanto a Herança herda apenas membros públicos."
      ],
      correctIndex: 1,
      explanation: "Herança ('é um') acopla rigidamente a subclasse à classe base em tempo de compilação. Associação ('tem um') conecta objetos de forma dinâmica, permitindo mudar as referências inclusive em tempo de execução, promovendo menor acoplamento."
    },
    {
      id: 5,
      question: "Como a relação de ciclo de vida das partes diferencia a Agregação da Composição?",
      options: [
        "Na Agregação, a parte não existe se o todo for destruído (ex: Motor sem Carro). Na Composição, a parte existe de forma independente (ex: Jogador sem Time).",
        "Na Agregação, as partes possuem ciclo de vida independente do todo (se o todo morre, a parte vive). Na Composição, a parte possui ciclo de vida dependente do todo e é destruída junto com ele.",
        "Composição usa a palavra-chave extends, enquanto Agregação usa implements.",
        "Na Composição o relacionamento é estático em nível de classe, na Agregação ele é puramente dinâmico."
      ],
      correctIndex: 1,
      explanation: "Na Agregação, a relação é fraca (ex: Professor e Departamento: se o departamento fecha, o professor continua ativo). Na Composição, a relação é forte e existencial (ex: Pedido e ItemPedido: se o pedido é deletado, os itens perdem o sentido e são eliminados)."
    },
    {
      id: 6,
      question: "Qual a principal diferença conceitual na relação que uma classe estabelece ao usar Herança de classe (extends) comparada à implementação de Interface (implements)?",
      options: [
        "Herança estende apenas dados, enquanto interfaces estendem comportamento e atributos privados.",
        "Herança compartilha estrutura de dados e comportamento comum ('é um'), enquanto Interfaces definem contratos puros de comportamento que as classes devem cumprir ('cumpre o papel de'), permitindo múltipla implementação.",
        "A classe pode herdar de várias superclasses, mas pode implementar no máximo uma interface.",
        "Estender uma classe é um relacionamento em nível de runtime, e implementar interface é estritamente em tempo de compilação."
      ],
      correctIndex: 1,
      explanation: "A Herança de classe promove o compartilhamento de código e estrutura (dados + código). A interface apenas padroniza assinaturas de métodos (contratos) sem impor herança de código, oferecendo alta flexibilidade e contornando a restrição de herança múltipla de classes em Java."
    },
    {
      id: 7,
      question: "Qual o papel dos modificadores de acesso privado (private) e público (public) na realização do conceito de Encapsulamento?",
      options: [
        "Eles servem apenas para organizar visualmente o código no editor de texto.",
        "O modificador private protege o estado (atributos) de alterações externas arbitrárias, enquanto o modificador public expõe métodos controlados (getters/setters) para ler e escrever o estado sob regras de validação.",
        "O modificador public torna os atributos imutáveis e o private permite que sejam alterados por qualquer classe do pacote.",
        "Private impede qualquer classe de ler o atributo, enquanto public permite que apenas subclasses alterem."
      ],
      correctIndex: 1,
      explanation: "Encapsular é proteger a consistência interna de um objeto. O 'private' fecha a porta para acessos diretos não autorizados, e os métodos 'public' servem como canais oficiais que controlam a entrada e saída de dados com validações."
    },
    {
      id: 8,
      question: "Por que dizemos que o Polimorfismo Dinâmico em Java depende intrinsecamente da Herança (ou de Interfaces) e da Sobrescrita (Override)?",
      options: [
        "Porque o polimorfismo só funciona se todas as classes pertencerem ao pacote padrão java.lang.",
        "Porque a Herança estabelece a relação de tipo comum (superclasse) permitindo a atribuição genérica, e a Sobrescrita garante que a JVM encontre o comportamento especializado no objeto real em tempo de execução.",
        "Porque a palavra-chave extends converte métodos estáticos em métodos dinâmicos.",
        "Porque sem a Herança a palavra-chave super() não poderia ser chamada para alternar comportamentos."
      ],
      correctIndex: 1,
      explanation: "Para tratar objetos diferentes de forma uniforme, eles precisam herdar de um ancestral comum ou interface comum (Herança/Upcasting). Além disso, o ancestral comum deve declarar o método, e as subclasses devem redefini-lo (Sobrescrita) para que cada uma execute sua versão apropriada."
    },
    {
      id: 9,
      question: "Conceitualmente, qual a principal diferença na resolução e comportamento entre a Sobrecarga (Overload) e a Sobrescrita (Override)?",
      options: [
        "Sobrecarga é resolvida em tempo de execução (polimorfismo dinâmico), e Sobrescrita em tempo de compilação.",
        "Sobrecarga cria variações do mesmo comportamento dentro da classe resolvidas na compilação (ligação estática), enquanto a Sobrescrita redefine o comportamento herdado e é resolvida em tempo de execução pela JVM (ligação dinâmica / polimorfismo dinâmico).",
        "Ambas exigem obrigatoriamente a anotação @Override.",
        "A Sobrecarga altera a superclasse a partir da subclasse, e a Sobrescrita é local do método."
      ],
      correctIndex: 1,
      explanation: "Sobrecarga (overload) é apenas um polimorfismo estático (em nível de assinatura de método na compilação). Já a sobrescrita (override) é o verdadeiro polimorfismo dinâmico, onde a decisão de qual código executar ocorre apenas em tempo de execução baseando-se no objeto real criado na Heap."
    },
    {
      id: 10,
      question: "Como o Construtor se relaciona conceitualmente com os Métodos em Java e qual sua função específica?",
      options: [
        "O construtor é um método comum que pode ser chamado a qualquer momento para redefinir o objeto.",
        "O construtor é um bloco especial com o mesmo nome da classe, sem tipo de retorno, cuja única função é inicializar os atributos do objeto imediatamente após a alocação de memória Heap feita pelo operador new.",
        "O construtor retorna uma referência do tipo void da Stack.",
        "O construtor é executado na Metaspace para carregar o blueprint da classe na JVM."
      ],
      correctIndex: 1,
      explanation: "Construtores não são métodos; eles não têm tipo de retorno. O operador 'new' faz a alocação do espaço na Heap, e em seguida invoca o construtor para dar valores iniciais aos atributos daquele espaço recém-alocado."
    },
    {
      id: 11,
      question: "Qual a relação conceitual de escopo entre membros (atributos/métodos) declarados como 'static' e membros de instância?",
      options: [
        "Membros static residem na Heap individual de cada objeto.",
        "Membros static pertencem à classe como um todo (carregados no Metaspace), sendo compartilhados por todas as instâncias, enquanto membros de instância pertencem exclusivamente a cada objeto individual na Heap.",
        "Métodos static podem ler livremente qualquer atributo de instância a qualquer momento.",
        "Atributos de instância duram tanto tempo quanto atributos static no ciclo de vida da aplicação."
      ],
      correctIndex: 1,
      explanation: "Membros marcados com 'static' não pertencem a objetos individuais. Eles pertencem ao blueprint da classe. Por isso, métodos 'static' não possuem a referência 'this' e não podem acessar atributos de instância diretamente (pois não há objeto associado no escopo do método static)."
    },
    {
      id: 12,
      question: "Qual o risco conceitual envolvido no Downcasting de tipos e qual exceção pode ser disparada em tempo de execução se essa relação falhar?",
      options: [
        "O downcasting converte subclasses em superclasses e pode causar NullPointerException.",
        "Downcasting é a conversão explícita de uma referência de superclasse para subclasse; se o objeto real na Heap não pertencer à subclasse alvo, a JVM lança uma ClassCastException.",
        "O downcasting é sempre seguro e resolvido automaticamente na compilação.",
        "Se o downcasting falhar, o compilador lança um erro de LinkageError em tempo de compilação."
      ],
      correctIndex: 1,
      explanation: "Upcasting é sempre seguro (todo Cachorro é Animal). Downcasting assume que o Animal é de fato um Cachorro. Se na Heap o objeto for um Gato, a conversão falha e a JVM dispara a exceção de runtime 'ClassCastException'."
    },
    {
      id: 13,
      question: "O que acontece conceitualmente na Heap quando executamos: 'Carro c1 = new Carro(); Carro c2 = c1;'?",
      options: [
        "A JVM duplica o objeto Carro na Heap, criando uma cópia com os mesmos valores.",
        "c1 e c2 passam a apontar para o MESMO objeto na Heap. Alterações feitas via c1 serão refletidas ao ler via c2 (Aliasing).",
        "c2 aponta para c1 na Stack, e c1 aponta para o objeto na Heap.",
        "O código gera um erro de compilação por declaração duplicada da variável c1."
      ],
      correctIndex: 1,
      explanation: "Variáveis de referência apenas guardam endereços. Fazer 'c2 = c1' copia o endereço de memória. Portanto, c1 e c2 referenciam o exato mesmo objeto na Heap. Isso é conhecido como aliasing."
    },
    {
      id: 14,
      question: "Conceitualmente, qual a relação e diferença entre uma Classe Abstrata (abstract class) e uma Classe Concreta?",
      options: [
        "Classes abstratas só podem conter métodos sem corpo, enquanto classes concretas só contêm métodos com corpo.",
        "Uma classe abstrata serve como molde conceitual incompleto que não pode ser instanciado diretamente, definindo comportamento comum e métodos abstratos para serem implementados obrigatoriamente por subclasses concretas.",
        "Classes concretas usam extends e classes abstratas usam implements.",
        "Uma classe abstrata é alocada na Stack de execução da JVM e a concreta na Heap."
      ],
      correctIndex: 1,
      explanation: "Classes abstratas modelam conceitos genéricos que não fazem sentido existir sozinhos (ex: Forma). Elas servem de base para que classes concretas (ex: Círculo) herdem as características gerais e implementem os métodos abstratos obrigatórios."
    },
    {
      id: 15,
      question: "Qual o efeito conceitual de aplicar o modificador 'final' em uma Classe comparado a aplicá-lo em um Atributo?",
      options: [
        "Uma classe final não pode ser instanciada e um atributo final não pode ser lido.",
        "Uma classe final não pode ser herdada (estendida), impedindo polimorfismo dinâmico por subclasse, enquanto um atributo final não pode ter seu valor reatribuído após a inicialização (constante).",
        "Ambos impedem qualquer tipo de compilação se forem declarados no mesmo arquivo.",
        "O atributo final torna-se privado, e a classe final torna-se abstrata."
      ],
      correctIndex: 1,
      explanation: "O 'final' em nível de classe interrompe a árvore de herança (ex: a classe String do Java é final). Em nível de atributo, ele cria uma constante de dados (o valor associado à referência na Stack ou Heap torna-se fixo após definido)."
    },
    {
      id: 16,
      question: "Como a regra de modelagem da Composição (ciclo de vida dependente) impacta a escrita de código dentro de um Construtor da classe contêiner (Todo)?",
      options: [
        "O construtor deve receber a referência pronta da parte via parâmetro e apenas guardá-la.",
        "O construtor da classe Todo deve ser responsável por instanciar a classe Parte interna (ex: 'this.motor = new Motor();'), garantindo que o ciclo de vida da parte comece e termine junto com o do Todo.",
        "O construtor não pode possuir atributos de outros tipos de classes associadas.",
        "A parte deve herdar da classe contêiner obrigatoriamente para manter o ciclo de vida."
      ],
      correctIndex: 1,
      explanation: "Na Composição, a parte não vive sem o todo. Por isso, a classe Todo não deve receber a instância de fora (isso seria Agregação). Ela mesma deve criar a instância internamente no seu construtor ou inicializadores."
    },
    {
      id: 17,
      question: "Como o uso de Interfaces habilita o Polimorfismo Dinâmico entre classes que pertencem a famílias de herança totalmente diferentes?",
      options: [
        "Forçando todas as classes a herdarem de uma única superclasse mágica da JVM.",
        "Ao fazer com que classes distintas implementem a mesma interface, permitindo agrupá-las sob a referência comum da interface e disparar métodos comuns, independentemente de suas árvores genealógicas de herança.",
        "Convertendo as referências de interface em tipos primitivos para compilar.",
        "Interfaces não permitem polimorfismo, apenas herança estática de métodos padrão."
      ],
      correctIndex: 1,
      explanation: "Classes como 'Documento' e 'Carro' não compartilham uma classe base comum (além de Object). Mas se ambas implementarem a interface 'Imprimivel', podemos agrupá-las sob a referência de 'Imprimivel' e invocar 'imprimir()', demonstrando polimorfismo dinâmico."
    },
    {
      id: 18,
      question: "Qual o valor conceitual de utilizar a anotação '@Override' na sobrescrita de métodos em subclasses?",
      options: [
        "Ela é obrigatória para que a JVM consiga realizar a ligação dinâmica em tempo de execução.",
        "Ela fornece segurança em tempo de compilação, obrigando o compilador a verificar se o método realmente existe e possui a mesma assinatura na classe pai, evitando erros sutis de digitação na sobrescrita.",
        "Ela permite que o método seja herdado de forma automática sem precisar de extends.",
        "Ela aumenta a visibilidade do método da superclasse para público."
      ],
      correctIndex: 1,
      explanation: "A anotação '@Override' não altera o runtime (a sobrescrita funciona sem ela). Porém, se você digitar o nome do método errado (ex: 'exibirinfo' em vez de 'exibirInfo'), sem a anotação, o Java tratará como um método novo (sobrecarga). Com ela, o compilador acusa erro imediatamente, garantindo que você está de fato sobrescrevendo."
    }
  ],
  flashcards: [
    {
      id: 1,
      front: "O que diferencia a Sobrecarga (Overload) da Sobrescrita (Override) de métodos em Java?",
      back: "• <b>Sobrecarga (Overload):</b> Métodos com o mesmo nome na mesma classe, mas com assinaturas diferentes (parâmetros distintos). Decidido na compilação.<br><br>• <b>Sobrescrita (Override):</b> Método na subclasse com a mesma assinatura do pai (usa @Override). Decidido na execução (polimorfismo)."
    },
    {
      id: 2,
      front: "O que acontece se nenhum construtor for declarado em uma classe Java?",
      back: "A JVM insere automaticamente um <b>construtor padrão sem parâmetros</b> (ex: public MinhaClasse() {}).<br><br><b>Atenção:</b> Se você criar qualquer construtor com parâmetros, o padrão deixa de existir."
    },
    {
      id: 3,
      front: "Como o Encapsulamento é implementado na prática em classes Java?",
      back: "1. Declarando os atributos de estado como <b>private</b> (ou protected).<br>2. Criando métodos de acesso públicos <b>getters</b> (leitura) e <b>setters</b> (escrita/validação) para acessar tais atributos de forma controlada."
    },
    {
      id: 4,
      front: "Para que serve a palavra-chave 'super' e em qual caso de herança seu uso é obrigatório?",
      back: "Acessa atributos/métodos da classe pai ou invoca seu construtor (super()).<br><br>É <b>obrigatório</b> no início do construtor da subclasse se a superclasse não tiver um construtor sem argumentos."
    },
    {
      id: 5,
      front: "O que diz a Regra de Ouro do Polimorfismo sobre referências e objetos?",
      back: "• O <b>Tipo da Referência</b> (Stack) determina quais métodos você pode chamar (tempo de compilação).<br><br>• O <b>Objeto Real</b> (Heap) determina qual versão do método será de fato executada (tempo de execução)."
    },
    {
      id: 6,
      front: "Qual a diferença entre herança de classes e implementação de interfaces em Java?",
      back: "• Java suporta apenas <b>herança simples de classes</b> (extends). Uma subclasse herda comportamento e estado (atributos).<br><br>• Java suporta <b>múltipla implementação de interfaces</b> (implements). Interfaces modelam apenas contratos de comportamento."
    },
    {
      id: 7,
      front: "Qual a diferença entre Composição e Agregação?",
      back: "• <b>Composição:</b> A parte NÃO existe sem o todo. Se o Pedido for deletado, os ItensPedido também são. Ciclo de vida dependente.<br><br>• <b>Agregação:</b> A parte PODE existir sem o todo. Se o Departamento for fechado, o Professor continua existindo. Ciclo de vida independente."
    },
    {
      id: 8,
      front: "Quais são os valores padrão dos atributos de instância em Java?",
      back: "• <b>int, long, short, byte:</b> 0<br>• <b>float, double:</b> 0.0<br>• <b>boolean:</b> false<br>• <b>char:</b> '\\u0000' (caractere nulo)<br>• <b>Referências (String, Objeto, etc.):</b> null<br><br><b>Importante:</b> Variáveis locais NÃO recebem valores padrão!"
    },
    {
      id: 9,
      front: "O que é a palavra-chave 'this' em Java e quando usá-la?",
      back: "• <b>'this'</b> é uma referência ao objeto atual (a instância que está executando o código).<br><br>• Usada para: <b>1)</b> Diferenciar atributo de instância de parâmetro com mesmo nome (this.nome = nome); <b>2)</b> Chamar outro construtor da mesma classe (this(args)); <b>3)</b> Passar o objeto atual como argumento para outro método."
    },
    {
      id: 10,
      front: "O que é NullPointerException e como evitá-la?",
      back: "• Exceção lançada quando tentamos usar uma referência que aponta para <b>null</b> (nenhum objeto).<br><br>• Para evitar: <b>1)</b> Sempre inicialize objetos com 'new' antes de usar; <b>2)</b> Verifique 'if (obj != null)' antes de chamar métodos; <b>3)</b> Use Optional<T> do Java 8+."
    },
    {
      id: 11,
      front: "O que é uma classe abstrata e quando usar?",
      back: "• Classe declarada com <b>abstract</b> que NÃO pode ser instanciada diretamente (não pode fazer 'new ClasseAbstrata()').<br><br>• Pode conter métodos abstratos (sem corpo) e concretos (com corpo).<br><br>• Use quando: há comportamento comum a ser herdado, mas a classe base não faz sentido sozinha (ex: Forma é abstrata, Círculo e Retângulo são concretos)."
    },
    {
      id: 12,
      front: "Qual a diferença entre 'final' em classes, métodos e atributos?",
      back: "• <b>final class:</b> A classe NÃO pode ser estendida (sem subclasses).<br><br>• <b>final método:</b> O método NÃO pode ser sobrescrito (@Override) pelas subclasses.<br><br>• <b>final atributo:</b> O valor NÃO pode ser reatribuído após inicialização (constante)."
    },
    {
      id: 13,
      front: "O que é casting de tipos em Java no contexto de Polimorfismo?",
      back: "• <b>Upcasting (implícito):</b> Subclasse → Superclasse. Ex: Animal a = new Cachorro(); (seguro, automático).<br><br>• <b>Downcasting (explícito):</b> Superclasse → Subclasse. Ex: Cachorro c = (Cachorro) a; (arriscado, pode lançar ClassCastException se o objeto real não for do tipo esperado)."
    },
    {
      id: 14,
      front: "O que significa 'static' em atributos e métodos?",
      back: "• <b>Atributo static:</b> Pertence à CLASSE, não às instâncias. Há apenas uma cópia compartilhada por todos os objetos.<br><br>• <b>Método static:</b> Pode ser chamado sem instanciar a classe (ex: Math.sqrt()). NÃO pode acessar atributos/métodos de instância diretamente (precisa de um objeto)."
    },
    {
      id: 15,
      front: "Quais são os 4 pilares da Programação Orientada a Objetos?",
      back: "• <b>Abstração:</b> Modelar apenas os aspectos relevantes do mundo real.<br><br>• <b>Encapsulamento:</b> Proteger os dados internos da classe (private + getters/setters).<br><br>• <b>Herança:</b> Reutilizar código criando subclasses (extends).<br><br>• <b>Polimorfismo:</b> Tratar objetos de subclasses diferentes de forma uniforme através da superclasse."
    }
  ],
  exercises: [
    // ==================== CLASSE (ex-1 a ex-6) ====================
    {
      id: "ex-1",
      title: "Declaração da Classe Aluno",
      difficulty: "Fácil",
      category: "Classe",
      instructions: "A estrutura a seguir deve representar a declaração de uma classe em Java para a entidade Aluno. Identifique a palavra-chave incorreta e corrija-a para que o código compile.",
      initialCode: `function Aluno {
    String nome;
    int idade;
}`,
      correctCode: `class Aluno {
    String nome;
    int idade;
}`,
      validationRegex: /class\s+Aluno\s*\{/,
      hint: "Em Java, usamos a palavra-chave 'class' para declarar uma classe, não 'function'.",
      errorSimulated: "error: class, interface, or enum expected\n  function Aluno {\n  ^"
    },
    {
      id: "ex-2",
      title: "Estrutura da Classe Produto",
      difficulty: "Fácil",
      category: "Classe",
      instructions: "O código abaixo apresenta um erro de compilação devido a um caractere delimitador ausente. Identifique e feche corretamente a estrutura da classe Produto.",
      initialCode: `public class Produto {
    String nome;
    double preco;
    
    void exibirInfo() {
        System.out.println(nome + ": R$" + preco);
    }`,
      correctCode: `public class Produto {
    String nome;
    double preco;
    
    void exibirInfo() {
        System.out.println(nome + ": R$" + preco);
    }
}`,
      validationRegex: /public\s+class\s+Produto\s*\{[\s\S]*void\s+exibirInfo[\s\S]*\}\s*\}/,
      hint: "Todo bloco aberto com '{' precisa de um correspondente '}'. A classe está sem sua chave de fechamento final.",
      errorSimulated: "error: reached end of file while parsing\n  }\n  ^"
    },
    {
      id: "ex-3",
      title: "Nomenclatura da Classe Calculadora",
      difficulty: "Fácil",
      category: "Classe",
      instructions: "Em Java, classes públicas devem seguir padrões específicos de nomenclatura e corresponder ao nome do arquivo associado. Ajuste a declaração da classe para que ela siga a convenção de letras maiúsculas exigida.",
      initialCode: `public class calculadora {
    int resultado;
    
    void somar(int a, int b) {
        resultado = a + b;
    }
}`,
      correctCode: `public class Calculadora {
    int resultado;
    
    void somar(int a, int b) {
        resultado = a + b;
    }
}`,
      validationRegex: /public\s+class\s+Calculadora\s*\{/,
      hint: "O nome da classe pública deve começar com letra maiúscula (PascalCase): 'calculadora' → 'Calculadora'. O nome do arquivo .java também deve ser 'Calculadora.java'.",
      errorSimulated: "error: class calculadora is public, should be declared in a file named calculadora.java"
    },
    {
      id: "ex-4",
      title: "Estrutura de Classes no Mesmo Arquivo",
      difficulty: "Médio",
      category: "Classe",
      instructions: "O arquivo contém duas declarações de classe, mas está gerando um erro de compilação referente às regras de visibilidade de classes em um mesmo arquivo. Ajuste o modificador de acesso da classe Endereco para resolver o problema.",
      initialCode: `public class Pessoa {
    String nome;
}

public class Endereco {
    String rua;
}`,
      correctCode: `public class Pessoa {
    String nome;
}

class Endereco {
    String rua;
}`,
      validationRegex: /\}\s*\n\s*class\s+Endereco\s*\{/,
      hint: "Só pode haver uma classe pública por arquivo .java. Remova 'public' da declaração da classe Endereco.",
      errorSimulated: "error: class Endereco is public, should be declared in a file named Endereco.java\npublic class Endereco {\n       ^"
    },
    {
      id: "ex-5",
      title: "Identificadores de Classes",
      difficulty: "Médio",
      category: "Classe",
      instructions: "A declaração abaixo gera um erro de compilação por tentar usar uma palavra reservada da linguagem Java como identificador. Renomeie a classe para 'MinhaClasse' de forma a restabelecer a validade do código.",
      initialCode: `public class class {
    String valor;
}`,
      correctCode: `public class MinhaClasse {
    String valor;
}`,
      validationRegex: /public\s+class\s+MinhaClasse\s*\{/,
      hint: "Palavras reservadas do Java (class, int, void, etc.) não podem ser usadas como nome de classe. Escolha outro nome como 'MinhaClasse'.",
      errorSimulated: "error: <identifier> expected\npublic class class {\n             ^"
    },
    {
      id: "ex-6",
      title: "Instanciação com Abstração",
      difficulty: "Difícil",
      category: "Classe",
      instructions: "O código abaixo tenta instanciar diretamente uma classe que serve apenas como molde abstrato. Corrija a instanciação para utilizar a classe concreta disponível e garantir que a área possa ser calculada e o código compile.",
      initialCode: `abstract class Forma {
    abstract double area();
}

class Circulo extends Forma {
    double raio = 5.0;
    double area() { return 3.14 * raio * raio; }
}

public class Teste {
    public static void main(String[] args) {
        Forma f = new Forma();
        System.out.println(f.area());
    }
}`,
      correctCode: `abstract class Forma {
    abstract double area();
}

class Circulo extends Forma {
    double raio = 5.0;
    double area() { return 3.14 * raio * raio; }
}

public class Teste {
    public static void main(String[] args) {
        Forma f = new Circulo();
        System.out.println(f.area());
    }
}`,
      validationRegex: /Forma\s+f\s*=\s*new\s+Circulo\s*\(\s*\)/,
      hint: "Classes abstratas não podem ser instanciadas. Substitua 'new Forma()' por 'new Circulo()'. Você pode manter o tipo da referência como Forma (polimorfismo).",
      errorSimulated: "error: Forma is abstract; cannot be instantiated\n        Forma f = new Forma();\n                  ^"
    },
    // ==================== OBJETO (ex-7 a ex-12) ====================
    {
      id: "ex-7",
      title: "Inicialização de Referências",
      difficulty: "Fácil",
      category: "Objeto",
      instructions: "O código abaixo compila, mas resulta em erro de execução ao tentar acessar atributos de uma referência nula. Ajuste o código para instanciar adequadamente o objeto antes de utilizá-lo.",
      initialCode: `class Carro {
    String modelo = "Fusca";
    void buzinar() { System.out.println("Beep!"); }
}

public class Teste {
    public static void main(String[] args) {
        Carro carro = null;
        System.out.println(carro.modelo);
    }
}`,
      correctCode: `class Carro {
    String modelo = "Fusca";
    void buzinar() { System.out.println("Beep!"); }
}

public class Teste {
    public static void main(String[] args) {
        Carro carro = new Carro();
        System.out.println(carro.modelo);
    }
}`,
      validationRegex: /Carro\s+carro\s*=\s*new\s+Carro\s*\(\s*\)/,
      hint: "Substitua 'null' por 'new Carro()' para instanciar o objeto antes de acessar seus membros.",
      errorSimulated: "Exception in thread \"main\" java.lang.NullPointerException: Cannot read field \"modelo\" because \"carro\" is null"
    },
    {
      id: "ex-8",
      title: "Instanciação de Conta",
      difficulty: "Fácil",
      category: "Objeto",
      instructions: "O código tenta criar uma nova instância de Conta, mas a sintaxe utilizada não é suportada em Java para criação de objetos. Corrija a instrução de criação do objeto para que o código compile.",
      initialCode: `class Conta {
    double saldo = 0;
}

public class Banco {
    public static void main(String[] args) {
        Conta minhaConta = Conta();
        System.out.println(minhaConta.saldo);
    }
}`,
      correctCode: `class Conta {
    double saldo = 0;
}

public class Banco {
    public static void main(String[] args) {
        Conta minhaConta = new Conta();
        System.out.println(minhaConta.saldo);
    }
}`,
      validationRegex: /Conta\s+minhaConta\s*=\s*new\s+Conta\s*\(\s*\)/,
      hint: "Em Java, a criação de objetos sempre requer o operador 'new' antes do nome da classe. Use 'new Conta()' em vez de apenas 'Conta()'.",
      errorSimulated: "error: cannot find symbol\n        Conta minhaConta = Conta();\n                           ^\n  symbol:   method Conta()\n  location: class Banco"
    },
    {
      id: "ex-9",
      title: "Compatibilidade de Tipos de Referência",
      difficulty: "Médio",
      category: "Objeto",
      instructions: "O compilador rejeita a linha de atribuição do objeto devido a uma incompatibilidade entre o tipo da variável declarada e o tipo do objeto instanciado. Faça o ajuste necessário na declaração para harmonizar os tipos.",
      initialCode: `class Animal {
    String nome = "Rex";
}

public class Teste {
    public static void main(String[] args) {
        String animal = new Animal();
        System.out.println(animal.nome);
    }
}`,
      correctCode: `class Animal {
    String nome = "Rex";
}

public class Teste {
    public static void main(String[] args) {
        Animal animal = new Animal();
        System.out.println(animal.nome);
    }
}`,
      validationRegex: /Animal\s+animal\s*=\s*new\s+Animal\s*\(\s*\)/,
      hint: "O tipo da variável deve ser compatível com o objeto criado. Troque 'String animal' por 'Animal animal'.",
      errorSimulated: "error: incompatible types: Animal cannot be converted to String\n        String animal = new Animal();\n                        ^"
    },
    {
      id: "ex-10",
      title: "Sintaxe do Operador de Instanciação",
      difficulty: "Fácil",
      category: "Objeto",
      instructions: "A criação do objeto Livro falha na compilação porque a invocação do construtor está incompleta. Corrija a sintaxe de instanciação para que o compilador aceite o código.",
      initialCode: `class Livro {
    String titulo = "Java Básico";
}

public class Teste {
    public static void main(String[] args) {
        Livro l = new Livro;
        System.out.println(l.titulo);
    }
}`,
      correctCode: `class Livro {
    String titulo = "Java Básico";
}

public class Teste {
    public static void main(String[] args) {
        Livro l = new Livro();
        System.out.println(l.titulo);
    }
}`,
      validationRegex: /Livro\s+l\s*=\s*new\s+Livro\s*\(\s*\)/,
      hint: "A chamada ao construtor requer parênteses: 'new Livro()' em vez de 'new Livro'.",
      errorSimulated: "error: '(' expected\n        Livro l = new Livro;\n                          ^"
    },
    {
      id: "ex-11",
      title: "Compartilhamento de Referência",
      difficulty: "Médio",
      category: "Objeto",
      instructions: "O objetivo deste trecho é fazer com que duas variáveis de referência apontem para a mesma única instância de Pessoa na memória. No entanto, o código atual cria dois objetos distintos. Ajuste a inicialização da variável p2 para que ela receba a referência de p1 diretamente.",
      initialCode: `class Pessoa {
    String nome = "Ana";
}

public class Teste {
    public static void main(String[] args) {
        Pessoa p1 = new Pessoa();
        Pessoa p2 = new Pessoa();
        p1.nome = "Carlos";
        System.out.println(p2.nome);
    }
}`,
      correctCode: `class Pessoa {
    String nome = "Ana";
}

public class Teste {
    public static void main(String[] args) {
        Pessoa p1 = new Pessoa();
        Pessoa p2 = p1;
        p1.nome = "Carlos";
        System.out.println(p2.nome);
    }
}`,
      validationRegex: /Pessoa\s+p2\s*=\s*p1\s*;/,
      hint: "Para que p2 aponte para o mesmo objeto que p1, basta fazer 'Pessoa p2 = p1;' sem usar 'new'. Assim ambas as variáveis referenciam o mesmo objeto na Heap.",
      errorSimulated: "Lógico: p2.nome imprime 'Ana' em vez de 'Carlos' porque p2 é um objeto diferente de p1."
    },
    {
      id: "ex-12",
      title: "Instanciação e Identificadores de Classe",
      difficulty: "Difícil",
      category: "Objeto",
      instructions: "O código falha ao tentar instanciar um tipo que não foi declarado no programa. Verifique os nomes das classes envolvidas e corrija a instanciação para que coincida com a definição existente.",
      initialCode: `class Computer {
    String marca = "Dell";
    void ligar() { System.out.println("Ligando..."); }
}

public class Teste {
    public static void main(String[] args) {
        Computador pc = new Computador();
        pc.ligar();
    }
}`,
      correctCode: `class Computer {
    String marca = "Dell";
    void ligar() { System.out.println("Ligando..."); }
}

public class Teste {
    public static void main(String[] args) {
        Computer pc = new Computer();
        pc.ligar();
    }
}`,
      validationRegex: /Computer\s+pc\s*=\s*new\s+Computer\s*\(\s*\)/,
      hint: "O nome usado na instanciação deve ser idêntico ao nome da classe declarada. A classe é 'Computer', não 'Computador'.",
      errorSimulated: "error: cannot find symbol\n        Computador pc = new Computador();\n        ^\n  symbol:   class Computador\n  location: class Teste"
    },
    // ==================== ATRIBUTO (ex-13 a ex-18) ====================
    {
      id: "ex-13",
      title: "Inicialização de Variáveis Locais",
      difficulty: "Fácil",
      category: "Atributo",
      instructions: "O compilador aponta que a variável local desconto pode não ter sido inicializada antes de ser utilizada no cálculo. Ajuste a declaração de desconto definindo um valor inicial de 0.10.",
      initialCode: `public class Loja {
    public static void main(String[] args) {
        double preco = 200.0;
        double desconto;
        double precoFinal = preco - (preco * desconto);
        System.out.println("Preço final: " + precoFinal);
    }
}`,
      correctCode: `public class Loja {
    public static void main(String[] args) {
        double preco = 200.0;
        double desconto = 0.10;
        double precoFinal = preco - (preco * desconto);
        System.out.println("Preço final: " + precoFinal);
    }
}`,
      validationRegex: /double\s+desconto\s*=\s*0\.10/,
      hint: "Variáveis locais precisam de inicialização explícita. Altere 'double desconto;' para 'double desconto = 0.10;'.",
      errorSimulated: "error: variable desconto might not have been initialized\n        double precoFinal = preco - (preco * desconto);\n                                                ^"
    },
    {
      id: "ex-14",
      title: "Modificadores de Constantes",
      difficulty: "Fácil",
      category: "Atributo",
      instructions: "O atributo taxa representa um valor imutável. Corrija o método aplicar de modo a respeitar a regra de não modificação imposta ao atributo taxa.",
      initialCode: `class Calculadora {
    final double taxa = 0.05;
    
    void aplicar(double valor) {
        taxa = 0.08;
    }
}`,
      correctCode: `class Calculadora {
    final double taxa = 0.05;
    
    void aplicar(double valor) {
    }
}`,
      validationRegex: /void\s+aplicar\s*\(\s*double\s+valor\s*\)\s*\{\s*\}/,
      hint: "Atributos declarados como 'final' não podem ter seu valor alterado. Remova a linha 'taxa = 0.08;'.",
      errorSimulated: "error: cannot assign a value to final variable taxa\n        taxa = 0.08;\n        ^"
    },
    {
      id: "ex-15",
      title: "Tipagem de Atributos",
      difficulty: "Médio",
      category: "Atributo",
      instructions: "A classe Funcionario possui um atributo declarado com um tipo incompatível com o valor que lhe é atribuído na inicialização. Ajuste a declaração desse atributo para o tipo numérico correspondente.",
      initialCode: `class Funcionario {
    String nome = "Maria";
    String idade = 25;
    double salario = 3500.0;
}`,
      correctCode: `class Funcionario {
    String nome = "Maria";
    int idade = 25;
    double salario = 3500.0;
}`,
      validationRegex: /int\s+idade\s*=\s*25/,
      hint: "O valor 25 é um número inteiro, não uma String. Troque 'String idade' por 'int idade'.",
      errorSimulated: "error: incompatible types: int cannot be converted to String\n    String idade = 25;\n                   ^"
    },
    {
      id: "ex-16",
      title: "Acesso a Membros Estáticos",
      difficulty: "Médio",
      category: "Atributo",
      instructions: "O compilador emite um alerta porque um atributo que pertence à classe está sendo acessado por meio de uma referência de objeto individual. Ajuste a forma de acesso na linha de impressão para seguir as boas práticas de membros estáticos.",
      initialCode: `class Produto {
    static int contador = 0;
    String nome;
    
    Produto(String nome) {
        this.nome = nome;
        contador++;
    }
}

public class Teste {
    public static void main(String[] args) {
        Produto p = new Produto("Caneta");
        System.out.println("Total: " + p.contador);
    }
}`,
      correctCode: `class Produto {
    static int contador = 0;
    String nome;
    
    Produto(String nome) {
        this.nome = nome;
        contador++;
    }
}

public class Teste {
    public static void main(String[] args) {
        Produto p = new Produto("Caneta");
        System.out.println("Total: " + Produto.contador);
    }
}`,
      validationRegex: /Produto\.contador/,
      hint: "Atributos static pertencem à classe, não à instância. Use 'Produto.contador' em vez de 'p.contador' para acessar corretamente.",
      errorSimulated: "warning: static member accessed via instance reference\n        System.out.println(\"Total: \" + p.contador);\n                                        ^"
    },
    {
      id: "ex-17",
      title: "Declaração de Tipo de Atributos",
      difficulty: "Fácil",
      category: "Atributo",
      instructions: "A inicialização do atributo ativo falha porque a linguagem Java exige tipagem estática e explícita para os campos de uma classe. Insira o tipo adequado para que a declaração do atributo ativo seja válida.",
      initialCode: `class Usuario {
    String nome = "Pedro";
    ativo = true;
}`,
      correctCode: `class Usuario {
    String nome = "Pedro";
    boolean ativo = true;
}`,
      validationRegex: /boolean\s+ativo\s*=\s*true/,
      hint: "Java exige declaração de tipo para toda variável. Adicione 'boolean' antes de 'ativo'.",
      errorSimulated: "error: <identifier> expected\n    ativo = true;\n         ^"
    },
    {
      id: "ex-18",
      title: "Escopo e Ambiguidade de Variáveis",
      difficulty: "Difícil",
      category: "Atributo",
      instructions: "O método `setNome` deve atribuir o valor do parâmetro recebido ao atributo `nome` do objeto correspondente. No entanto, devido à colisão de nomes, o valor não está sendo associado corretamente à instância. Corrija a instrução interna do método para resolver essa ambiguidade de escopo.",
      initialCode: `class Pessoa {
    String nome;
    
    void setNome(String nome) {
        nome = nome;
    }
}`,
      correctCode: `class Pessoa {
    String nome;
    
    void setNome(String nome) {
        this.nome = nome;
    }
}`,
      validationRegex: /this\.nome\s*=\s*nome/,
      hint: "Quando o parâmetro tem o mesmo nome do atributo, use 'this.nome' para se referir ao atributo de instância. 'nome = nome' apenas atribui o parâmetro a si mesmo.",
      errorSimulated: "Lógico: O atributo 'nome' nunca é alterado. Após chamar setNome(\"Ana\"), this.nome continua null."
    },
    // ==================== MÉTODO (ex-19 a ex-24) ====================
    {
      id: "ex-19",
      title: "Cálculo de Área de Retângulo",
      difficulty: "Fácil",
      category: "Método",
      instructions: "O método `getArea` deve calcular e retornar a área de um retângulo com base em sua largura e altura. Encontre o erro no método que impede a compilação do código e faça a correção necessária.",
      initialCode: `class Retangulo {
    double largura = 10;
    double altura = 5;
    
    double getArea() {
        largura * altura;
    }
}`,
      correctCode: `class Retangulo {
    double largura = 10;
    double altura = 5;
    
    double getArea() {
        return largura * altura;
    }
}`,
      validationRegex: /return\s+largura\s*\*\s*altura/,
      hint: "Métodos com tipo de retorno diferente de void devem ter a instrução 'return'. Adicione 'return' antes da expressão.",
      errorSimulated: "error: missing return statement\n    }\n    ^"
    },
    {
      id: "ex-20",
      title: "Exibição de Mensagem de Boas-Vindas",
      difficulty: "Fácil",
      category: "Método",
      instructions: "O método `exibir` tem como objetivo exibir a mensagem na saída padrão do sistema, sem retornar nenhum valor para quem o chamou. Identifique o erro na estrutura de retorno deste método e corrija-o para que a classe compile.",
      initialCode: `class Mensagem {
    void exibir() {
        String msg = "Olá, Mundo!";
        return msg;
    }
}`,
      correctCode: `class Mensagem {
    void exibir() {
        String msg = "Olá, Mundo!";
        System.out.println(msg);
    }
}`,
      validationRegex: /System\.out\.println\s*\(\s*msg\s*\)/,
      hint: "Métodos void não podem retornar valores. Substitua 'return msg;' por 'System.out.println(msg);'.",
      errorSimulated: "error: incompatible types: unexpected return value\n        return msg;\n               ^"
    },
    {
      id: "ex-21",
      title: "Acesso a Atributos de Instância no Método Principal",
      difficulty: "Difícil",
      category: "Método",
      instructions: "O método `main` deve exibir o nome definido no atributo de instância da classe `Teste`. Ajuste o código para resolver a inconsistência no acesso aos membros da classe de modo que a compilação seja bem-sucedida.",
      initialCode: `public class Teste {
    String nome = "Ana";
    
    public static void main(String[] args) {
        System.out.println("Nome: " + nome);
    }
}`,
      correctCode: `public class Teste {
    String nome = "Ana";
    
    public static void main(String[] args) {
        Teste t = new Teste();
        System.out.println("Nome: " + t.nome);
    }
}`,
      validationRegex: /Teste\s+\w+\s*=\s*new\s+Teste\s*\(\s*\)[\s\S]*\w+\.nome/,
      hint: "Crie uma instância de Teste (ex: 'Teste t = new Teste();') e acesse o atributo via referência 't.nome'.",
      errorSimulated: "error: non-static variable nome cannot be referenced from a static context\n        System.out.println(\"Nome: \" + nome);\n                                      ^"
    },
    {
      id: "ex-22",
      title: "Operação Aritmética na Calculadora",
      difficulty: "Médio",
      category: "Método",
      instructions: "A classe `Calculadora` possui um método para somar dois valores inteiros. Ao tentar invocar esse método na classe `Teste`, ocorreu um erro de incompatibilidade de tipos de dados. Corrija os argumentos fornecidos na chamada do método para que o programa compile corretamente.",
      initialCode: `class Calculadora {
    int somar(int a, int b) {
        return a + b;
    }
}

public class Teste {
    public static void main(String[] args) {
        Calculadora calc = new Calculadora();
        int resultado = calc.somar("10", "20");
        System.out.println(resultado);
    }
}`,
      correctCode: `class Calculadora {
    int somar(int a, int b) {
        return a + b;
    }
}

public class Teste {
    public static void main(String[] args) {
        Calculadora calc = new Calculadora();
        int resultado = calc.somar(10, 20);
        System.out.println(resultado);
    }
}`,
      validationRegex: /calc\.somar\s*\(\s*10\s*,\s*20\s*\)/,
      hint: "Remova as aspas de \"10\" e \"20\". O método espera int, não String. Use: calc.somar(10, 20).",
      errorSimulated: "error: incompatible types: String cannot be converted to int\n        int resultado = calc.somar(\"10\", \"20\");\n                                   ^"
    },
    {
      id: "ex-23",
      title: "Obtenção do Nome de Pessoa",
      difficulty: "Médio",
      category: "Método",
      instructions: "O método `getNome` deve retornar o texto correspondente ao nome da pessoa. Identifique a inconsistência entre o tipo de retorno declarado e o valor retornado na assinatura do método, e faça o ajuste necessário.",
      initialCode: `class Pessoa {
    String nome = "Carlos";
    
    int getNome() {
        return nome;
    }
}`,
      correctCode: `class Pessoa {
    String nome = "Carlos";
    
    String getNome() {
        return nome;
    }
}`,
      validationRegex: /String\s+getNome\s*\(\s*\)/,
      hint: "O tipo de retorno deve ser compatível com o que está sendo retornado. O atributo 'nome' é String, então o método deve retornar String.",
      errorSimulated: "error: incompatible types: String cannot be converted to int\n        return nome;\n               ^"
    },
    {
      id: "ex-24",
      title: "Ativação do Motor de um Veículo",
      difficulty: "Fácil",
      category: "Método",
      instructions: "A classe `Teste` tenta iniciar o funcionamento de um objeto da classe `Motor` por meio de seu método `ligar`. Identifique o erro de sintaxe na linha que tenta executar a ação e faça a devida correção para que o programa compile.",
      initialCode: `class Motor {
    void ligar() {
        System.out.println("Motor ligado!");
    }
}

public class Teste {
    public static void main(String[] args) {
        Motor m = new Motor();
        m.ligar;
    }
}`,
      correctCode: `class Motor {
    void ligar() {
        System.out.println("Motor ligado!");
    }
}

public class Teste {
    public static void main(String[] args) {
        Motor m = new Motor();
        m.ligar();
    }
}`,
      validationRegex: /m\.ligar\s*\(\s*\)/,
      hint: "Chamadas de método em Java sempre necessitam de parênteses: 'm.ligar()' e não 'm.ligar'.",
      errorSimulated: "error: cannot find symbol\n        m.ligar;\n         ^\n  symbol:   variable ligar\n  location: variable m of type Motor"
    },
    // ==================== VISIBILIDADE (ex-25 a ex-30) ====================
    {
      id: "ex-25",
      title: "Acesso Seguro ao Saldo Bancário",
      difficulty: "Fácil",
      category: "Visibilidade",
      instructions: "A classe `Principal` deve exibir o saldo de uma conta bancária. No entanto, o saldo foi encapsulado para proteção dos dados e não pode ser acessado diretamente. Ajuste a forma de acesso na classe `Principal` para que o saldo seja exibido corretamente utilizando a interface pública da classe `Conta`.",
      initialCode: `class Conta {
    private double saldo = 100.0;
    public double getSaldo() { return this.saldo; }
}

public class Principal {
    public static void main(String[] args) {
        Conta conta = new Conta();
        System.out.println("Saldo: " + conta.saldo);
    }
}`,
      correctCode: `class Conta {
    private double saldo = 100.0;
    public double getSaldo() { return this.saldo; }
}

public class Principal {
    public static void main(String[] args) {
        Conta conta = new Conta();
        System.out.println("Saldo: " + conta.getSaldo());
    }
}`,
      validationRegex: /conta\.getSaldo\s*\(\s*\)/,
      hint: "Substitua 'conta.saldo' pelo método getter público 'conta.getSaldo()'.",
      errorSimulated: "error: saldo has private access in Conta\n        System.out.println(\"Saldo: \" + conta.saldo);\n                                             ^"
    },
    {
      id: "ex-26",
      title: "Alteração Controlada de Atributo Privado",
      difficulty: "Médio",
      category: "Visibilidade",
      instructions: "A classe `Pessoa` possui o atributo privado `idade`. Na classe `Teste`, tenta-se alterar o valor desse atributo, mas a tentativa de acesso direto causa um erro de compilação. Adicione o método modificador adequado na classe `Pessoa` e ajuste sua chamada na classe `Teste` para que a alteração seja feita corretamente seguindo as regras de visibilidade.",
      initialCode: `class Pessoa {
    private int idade;
    
    public int getIdade() { return this.idade; }
}

public class Teste {
    public static void main(String[] args) {
        Pessoa p = new Pessoa();
        p.idade = 25;
        System.out.println(p.getIdade());
    }
}`,
      correctCode: `class Pessoa {
    private int idade;
    
    public int getIdade() { return this.idade; }
    
    public void setIdade(int idade) { this.idade = idade; }
}

public class Teste {
    public static void main(String[] args) {
        Pessoa p = new Pessoa();
        p.setIdade(25);
        System.out.println(p.getIdade());
    }
}`,
      validationRegex: /p\.setIdade\s*\(\s*25\s*\)/,
      hint: "Crie um setter na classe Pessoa: 'public void setIdade(int idade) { this.idade = idade; }'. Na classe Teste, use 'p.setIdade(25)' em vez de 'p.idade = 25'.",
      errorSimulated: "error: idade has private access in Pessoa\n        p.idade = 25;\n         ^"
    },
    {
      id: "ex-27",
      title: "Cálculo Externo de Juros de Conta",
      difficulty: "Médio",
      category: "Visibilidade",
      instructions: "A classe `Teste` precisa obter o valor dos juros da conta bancária chamando o método `calcularJuros`. Identifique o modificador de acesso que está impedindo essa chamada externa e altere-o para tornar o método acessível a outras classes.",
      initialCode: `class ContaBancaria {
    double saldo = 1000.0;
    
    private double calcularJuros() {
        return saldo * 0.02;
    }
}

public class Teste {
    public static void main(String[] args) {
        ContaBancaria cb = new ContaBancaria();
        System.out.println("Juros: " + cb.calcularJuros());
    }
}`,
      correctCode: `class ContaBancaria {
    double saldo = 1000.0;
    
    public double calcularJuros() {
        return saldo * 0.02;
    }
}

public class Teste {
    public static void main(String[] args) {
        ContaBancaria cb = new ContaBancaria();
        System.out.println("Juros: " + cb.calcularJuros());
    }
}`,
      validationRegex: /public\s+double\s+calcularJuros\s*\(\s*\)/,
      hint: "Altere 'private double calcularJuros()' para 'public double calcularJuros()' para tornar o método acessível externamente.",
      errorSimulated: "error: calcularJuros() has private access in ContaBancaria\n        System.out.println(\"Juros: \" + cb.calcularJuros());\n                                          ^"
    },
    {
      id: "ex-28",
      title: "Acesso a CPF em Pacotes Distintos",
      difficulty: "Difícil",
      category: "Visibilidade",
      instructions: "A classe `Teste` pertence a um pacote diferente e não possui relação de parentesco com a classe `Cliente`. Por esse motivo, o acesso direto ao atributo `cpf` causa erro. Ajuste o código da classe `Teste` de modo a obter o CPF por meio da interface pública disponível na classe `Cliente`.",
      initialCode: `// Arquivo: modelo/Cliente.java
class Cliente {
    protected String cpf = "123.456.789-00";
    
    public String getCpf() { return this.cpf; }
}

// Arquivo: app/Teste.java (pacote diferente, não é subclasse)
public class Teste {
    public static void main(String[] args) {
        Cliente c = new Cliente();
        System.out.println(c.cpf);
    }
}`,
      correctCode: `// Arquivo: modelo/Cliente.java
class Cliente {
    protected String cpf = "123.456.789-00";
    
    public String getCpf() { return this.cpf; }
}

// Arquivo: app/Teste.java (pacote diferente, não é subclasse)
public class Teste {
    public static void main(String[] args) {
        Cliente c = new Cliente();
        System.out.println(c.getCpf());
    }
}`,
      validationRegex: /c\.getCpf\s*\(\s*\)/,
      hint: "Em outro pacote, atributos protected não são acessíveis diretamente. Use o getter público: 'c.getCpf()'.",
      errorSimulated: "error: cpf has protected access in Cliente\n        System.out.println(c.cpf);\n                            ^"
    },
    {
      id: "ex-29",
      title: "Encapsulamento de Dados do Usuário",
      difficulty: "Difícil",
      category: "Visibilidade",
      instructions: "Para garantir a segurança e o controle dos dados da classe `Usuario`, o atributo `email` não deve ficar exposto diretamente ao público, forçando o uso dos métodos de acesso já existentes. Modifique a declaração do atributo para restringir o seu acesso direto.",
      initialCode: `class Usuario {
    public String email = "user@email.com";
    
    public String getEmail() {
        return this.email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
}`,
      correctCode: `class Usuario {
    private String email = "user@email.com";
    
    public String getEmail() {
        return this.email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
}`,
      validationRegex: /private\s+String\s+email/,
      hint: "Mude 'public String email' para 'private String email' para seguir o princípio do encapsulamento. Os métodos getter e setter já existem.",
      errorSimulated: "Aviso de boas práticas: Atributos não devem ser públicos quando existem getters e setters. Use 'private' para proteger o dado."
    },
    {
      id: "ex-30",
      title: "Visibilidade de Atributo de Produto",
      difficulty: "Difícil",
      category: "Visibilidade",
      instructions: "A classe `Loja` está em um pacote diferente da classe `Produto` e precisa acessar o atributo `nome` do produto. Corrija o modificador de acesso na classe `Produto` para que ela permita que classes de qualquer outro pacote acessem esse atributo diretamente.",
      initialCode: `// pacote modelo
class Produto {
    String nome = "Notebook";
}

// pacote app (outro pacote)
public class Loja {
    public static void main(String[] args) {
        Produto p = new Produto();
        System.out.println(p.nome);
    }
}`,
      correctCode: `// pacote modelo
class Produto {
    public String nome = "Notebook";
}

// pacote app (outro pacote)
public class Loja {
    public static void main(String[] args) {
        Produto p = new Produto();
        System.out.println(p.nome);
    }
}`,
      validationRegex: /public\s+String\s+nome\s*=\s*"Notebook"/,
      hint: "A visibilidade default não permite acesso de outros pacotes. Adicione 'public' antes de 'String nome' para permitir acesso externo.",
      errorSimulated: "error: nome is not public in Produto; cannot be accessed from outside package\n        System.out.println(p.nome);\n                            ^"
    },
    // ==================== CONSTRUTOR (ex-31 a ex-36) ====================
    {
      id: "ex-31",
      title: "Inicialização de Objetos da Classe Pessoa",
      difficulty: "Fácil",
      category: "Construtor",
      instructions: "A classe `Pessoa` deve inicializar o atributo `nome` no momento de sua instanciação. No entanto, a declaração do construtor possui um erro conceitual de sintaxe que o transforma em um método comum. Identifique e corrija essa declaração.",
      initialCode: `public class Pessoa {
    String nome;
    
    public void Pessoa(String nome) {
        this.nome = nome;
    }
}`,
      correctCode: `public class Pessoa {
    String nome;
    
    public Pessoa(String nome) {
        this.nome = nome;
    }
}`,
      validationRegex: /public\s+Pessoa\s*\(\s*String\s+nome\s*\)/,
      hint: "Construtores NÃO possuem tipo de retorno, nem mesmo void. Remova 'void' da assinatura.",
      errorSimulated: "error: invalid method declaration; return type required\n    public void Pessoa(String nome) {\n                ^"
    },
    {
      id: "ex-32",
      title: "Inicialização de Subclasse em Hierarquia",
      difficulty: "Médio",
      category: "Construtor",
      instructions: "A classe `Carro` estende a classe `Veiculo`. Como `Veiculo` não possui um construtor padrão (sem argumentos), o construtor da classe `Carro` deve invocar explicitamente o construtor da superclasse passando o parâmetro necessário. Faça o ajuste no construtor da classe `Carro` para resolver o erro de compilação.",
      initialCode: `class Veiculo {
    String marca;
    Veiculo(String marca) { this.marca = marca; }
}

class Carro extends Veiculo {
    int portas;
    Carro(String marca, int portas) {
        this.portas = portas;
    }
}`,
      correctCode: `class Veiculo {
    String marca;
    Veiculo(String marca) { this.marca = marca; }
}

class Carro extends Veiculo {
    int portas;
    Carro(String marca, int portas) {
        super(marca);
        this.portas = portas;
    }
}`,
      validationRegex: /super\s*\(\s*marca\s*\)/,
      hint: "Quando a superclasse não possui construtor sem argumentos, a subclasse deve chamar 'super(argumento)' como primeira linha do construtor.",
      errorSimulated: "error: constructor Veiculo in class Veiculo cannot be applied to given types;\n  required: java.lang.String\n  found: no arguments"
    },
    {
      id: "ex-33",
      title: "Instanciação de Aluno com Construtor Parametrizado",
      difficulty: "Médio",
      category: "Construtor",
      instructions: "Ao definir um construtor personalizado para a classe `Aluno`, o construtor padrão automático deixa de existir. A classe `Teste` está tentando criar uma instância sem passar os argumentos necessários. Corrija a instanciação para fornecer dados compatíveis com o construtor definido.",
      initialCode: `class Aluno {
    String nome;
    int idade;
    
    Aluno(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }
}

public class Teste {
    public static void main(String[] args) {
        Aluno a = new Aluno();
        System.out.println(a.nome);
    }
}`,
      correctCode: `class Aluno {
    String nome;
    int idade;
    
    Aluno(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }
}

public class Teste {
    public static void main(String[] args) {
        Aluno a = new Aluno("Maria", 20);
        System.out.println(a.nome);
    }
}`,
      validationRegex: /new\s+Aluno\s*\(\s*"Maria"\s*,\s*20\s*\)/,
      hint: "Quando existe um construtor parametrizado, o construtor padrão desaparece. Passe os argumentos: new Aluno(\"Maria\", 20).",
      errorSimulated: "error: constructor Aluno in class Aluno cannot be applied to given types;\n  required: String, int\n  found: no arguments"
    },
    {
      id: "ex-34",
      title: "Sintaxe do Construtor de Produto",
      difficulty: "Fácil",
      category: "Construtor",
      instructions: "A classe `Produto` define um bloco para inicializar seus atributos durante a criação do objeto. No entanto, a declaração desse construtor possui um desvio em relação às regras de nomenclatura do Java. Identifique o erro e faça a correção correspondente.",
      initialCode: `public class Produto {
    String nome;
    
    public produto(String nome) {
        this.nome = nome;
    }
}`,
      correctCode: `public class Produto {
    String nome;
    
    public Produto(String nome) {
        this.nome = nome;
    }
}`,
      validationRegex: /public\s+Produto\s*\(\s*String\s+nome\s*\)/,
      hint: "O nome do construtor deve ser exatamente igual ao nome da classe, incluindo maiúsculas e minúsculas: 'produto' → 'Produto'.",
      errorSimulated: "error: invalid method declaration; return type required\n    public produto(String nome) {\n           ^"
    },
    {
      id: "ex-35",
      title: "Sobrecarga de Construtores de Pessoa",
      difficulty: "Difícil",
      category: "Construtor",
      instructions: "Para evitar a duplicação de lógica e promover o reaproveitamento de código, o construtor sem parâmetros da classe `Pessoa` deve delegar a inicialização do atributo `nome` para o outro construtor da própria classe. Substitua a atribuição direta pela chamada de construtor apropriada.",
      initialCode: `class Pessoa {
    String nome;
    
    Pessoa() {
        this.nome = "Sem Nome";
    }
    
    Pessoa(String nome) {
        this.nome = nome;
    }
}`,
      correctCode: `class Pessoa {
    String nome;
    
    Pessoa() {
        this("Sem Nome");
    }
    
    Pessoa(String nome) {
        this.nome = nome;
    }
}`,
      validationRegex: /Pessoa\s*\(\s*\)\s*\{\s*this\s*\(\s*"Sem Nome"\s*\)\s*;\s*\}/,
      hint: "Use 'this(\"Sem Nome\")' para delegar a inicialização ao construtor parametrizado, evitando duplicação de lógica.",
      errorSimulated: "Aviso de boas práticas: Duplicação de lógica de inicialização. Use this() para delegar entre construtores."
    },
    {
      id: "ex-36",
      title: "Ordem de Chamadas no Construtor da Subclasse",
      difficulty: "Difícil",
      category: "Construtor",
      instructions: "Na classe `Aluno`, a chamada ao construtor da superclasse `Pessoa` não está posicionada no local correto exigido pelas regras de compilação da linguagem Java. Corrija a ordem das instruções dentro do construtor para restabelecer a integridade do código.",
      initialCode: `class Pessoa {
    String nome;
    Pessoa(String nome) { this.nome = nome; }
}

class Aluno extends Pessoa {
    int matricula;
    
    Aluno(String nome, int matricula) {
        this.matricula = matricula;
        super(nome);
    }
}`,
      correctCode: `class Pessoa {
    String nome;
    Pessoa(String nome) { this.nome = nome; }
}

class Aluno extends Pessoa {
    int matricula;
    
    Aluno(String nome, int matricula) {
        super(nome);
        this.matricula = matricula;
    }
}`,
      validationRegex: /Aluno\s*\(\s*String\s+nome\s*,\s*int\s+matricula\s*\)\s*\{\s*super\s*\(\s*nome\s*\)\s*;\s*this\.matricula/,
      hint: "A chamada 'super()' ou 'super(args)' DEVE ser a primeira instrução do construtor. Mova-a para antes de qualquer outra instrução.",
      errorSimulated: "error: call to super must be first statement in constructor\n        super(nome);\n             ^"
    },
    // ==================== HERANÇA (ex-37 a ex-42) ====================
    {
      id: "ex-37",
      title: "Estrutura de Herança de Anfibio",
      difficulty: "Médio",
      category: "Herança",
      instructions: "A classe `Anfibio` deve herdar os comportamentos básicos da classe `Animal`. No entanto, a declaração de herança viola as regras básicas da linguagem Java sobre o número de superclasses permitidas para uma classe. Identifique o erro de estrutura e faça o ajuste para que a classe compile.",
      initialCode: `class Animal {}
class Veiculo {}

class Anfibio extends Animal, Veiculo {
    void nadar() { System.out.println("Nadando..."); }
}`,
      correctCode: `class Animal {}
class Veiculo {}

class Anfibio extends Animal {
    void nadar() { System.out.println("Nadando..."); }
}`,
      validationRegex: /class\s+Anfibio\s+extends\s+Animal\s*\{/,
      hint: "Java só permite herança simples de classes. Remova ', Veiculo' da declaração: 'extends Animal'.",
      errorSimulated: "error: '{' expected\nclass Anfibio extends Animal, Veiculo {\n                            ^"
    },
    {
      id: "ex-38",
      title: "Especialização da Classe Dispositivo",
      difficulty: "Médio",
      category: "Herança",
      instructions: "A classe `Celular` deve estender a classe `Dispositivo` para herdar suas características. Analise a declaração da classe `Dispositivo` e identifique o modificador que impede a criação de subclasses. Faça o ajuste necessário para permitir a herança.",
      initialCode: `final class Dispositivo {
    String marca;
}

class Celular extends Dispositivo {
    int memoria;
}`,
      correctCode: `class Dispositivo {
    String marca;
}

class Celular extends Dispositivo {
    int memoria;
}`,
      validationRegex: /^class\s+Dispositivo\s*\{/m,
      hint: "Remova a palavra-chave 'final' da declaração 'final class Dispositivo' para permitir herança.",
      errorSimulated: "error: cannot inherit from final Dispositivo\nclass Celular extends Dispositivo {\n                      ^"
    },
    {
      id: "ex-39",
      title: "Implementação de Parentesco entre Classes",
      difficulty: "Fácil",
      category: "Herança",
      instructions: "A classe `Cachorro` deve herdar os membros da classe `Animal`. Encontre o erro de sintaxe cometido na palavra-chave de herança e ajuste-o de acordo com as regras da linguagem Java.",
      initialCode: `class Animal {
    void respirar() { System.out.println("Respirando..."); }
}

class Cachorro inherits Animal {
    void latir() { System.out.println("Au Au!"); }
}`,
      correctCode: `class Animal {
    void respirar() { System.out.println("Respirando..."); }
}

class Cachorro extends Animal {
    void latir() { System.out.println("Au Au!"); }
}`,
      validationRegex: /class\s+Cachorro\s+extends\s+Animal\s*\{/,
      hint: "Em Java, a palavra-chave para herança é 'extends', não 'inherits'. Use: 'class Cachorro extends Animal'.",
      errorSimulated: "error: '{' expected\nclass Cachorro inherits Animal {\n               ^"
    },
    {
      id: "ex-40",
      title: "Acesso a Atributos Privados na Subclasse",
      difficulty: "Difícil",
      category: "Herança",
      instructions: "A subclasse `ContaPoupanca` precisa calcular seu rendimento mensal com base no saldo da conta. Entretanto, o atributo `saldo` está restrito à superclasse `ContaBancaria`. Ajuste o método de cálculo para obter esse valor de maneira segura, utilizando a interface pública herdada.",
      initialCode: `class ContaBancaria {
    private double saldo = 1000.0;
    
    public double getSaldo() { return this.saldo; }
}

class ContaPoupanca extends ContaBancaria {
    double calcularRendimento() {
        return saldo * 0.005;
    }
}`,
      correctCode: `class ContaBancaria {
    private double saldo = 1000.0;
    
    public double getSaldo() { return this.saldo; }
}

class ContaPoupanca extends ContaBancaria {
    double calcularRendimento() {
        return getSaldo() * 0.005;
    }
}`,
      validationRegex: /return\s+getSaldo\s*\(\s*\)\s*\*\s*0\.005/,
      hint: "Membros private não são herdados diretamente pelas subclasses. Use o getter público 'getSaldo()' em vez de 'saldo'.",
      errorSimulated: "error: saldo has private access in ContaBancaria\n        return saldo * 0.005;\n               ^"
    },
    {
      id: "ex-41",
      title: "Assinatura do Contrato de Interface",
      difficulty: "Médio",
      category: "Herança",
      instructions: "A classe `Passaro` deve adotar o comportamento definido pela interface `Voavel`. Analise a palavra-chave utilizada para estabelecer essa relação e corrija o erro de compilação.",
      initialCode: `interface Voavel {
    void voar();
}

class Passaro extends Voavel {
    public void voar() {
        System.out.println("Voando...");
    }
}`,
      correctCode: `interface Voavel {
    void voar();
}

class Passaro implements Voavel {
    public void voar() {
        System.out.println("Voando...");
    }
}`,
      validationRegex: /class\s+Passaro\s+implements\s+Voavel\s*\{/,
      hint: "Interfaces são implementadas com 'implements', não 'extends'. Use: 'class Passaro implements Voavel'.",
      errorSimulated: "error: no interface expected here\nclass Passaro extends Voavel {\n                      ^"
    },
    {
      id: "ex-42",
      title: "Herança e Implementação Conjuntas",
      difficulty: "Difícil",
      category: "Herança",
      instructions: "A classe `Pato` é um `Animal` e também possui a capacidade de agir como `Nadador`. Identifique a falha na declaração de herança e de interface na classe `Pato`, ajustando a sintaxe para declarar ambas corretamente.",
      initialCode: `class Animal {
    void comer() { System.out.println("Comendo..."); }
}

interface Nadador {
    void nadar();
}

class Pato extends Animal, Nadador {
    public void nadar() { System.out.println("Nadando..."); }
}`,
      correctCode: `class Animal {
    void comer() { System.out.println("Comendo..."); }
}

interface Nadador {
    void nadar();
}

class Pato extends Animal implements Nadador {
    public void nadar() { System.out.println("Nadando..."); }
}`,
      validationRegex: /class\s+Pato\s+extends\s+Animal\s+implements\s+Nadador\s*\{/,
      hint: "Use 'extends' para herdar da classe e 'implements' para implementar a interface: 'class Pato extends Animal implements Nadador'.",
      errorSimulated: "error: '{' expected\nclass Pato extends Animal, Nadador {\n                         ^"
    },
    // ==================== ASSOCIAÇÃO (ex-43 a ex-47) ====================
    {
      id: "ex-43",
      title: "Composição do Objeto Carro e Motor",
      difficulty: "Fácil",
      category: "Associação",
      instructions: "Ao tentar acionar o motor do carro, ocorre um erro de execução indicando que a referência do motor está vazia. Seguindo a regra de composição, certifique-se de instanciar o motor adequadamente dentro do construtor da classe `Carro`.",
      initialCode: `class Motor {
    void ligar() { System.out.println("Vrum!"); }
}

class Carro {
    Motor motor;
    
    Carro() {
    }
    
    void ligarCarro() {
        this.motor.ligar();
    }
}`,
      correctCode: `class Motor {
    void ligar() { System.out.println("Vrum!"); }
}

class Carro {
    Motor motor;
    
    Carro() {
        this.motor = new Motor();
    }
    
    void ligarCarro() {
        this.motor.ligar();
    }
}`,
      validationRegex: /this\.motor\s*=\s*new\s+Motor\s*\(\s*\)/,
      hint: "Inicialize o motor no construtor: 'this.motor = new Motor();'.",
      errorSimulated: "Exception in thread \"main\" java.lang.NullPointerException: Cannot invoke \"Motor.ligar()\" because \"this.motor\" is null"
    },
    {
      id: "ex-44",
      title: "Associação de Professor ao Departamento",
      difficulty: "Médio",
      category: "Associação",
      instructions: "A classe `Departamento` possui um atributo para representar o professor associado. Como se trata de uma agregação, a referência do professor deve ser passada de fora para o departamento no momento da sua construção. Ajuste o construtor do departamento para receber e registrar essa referência externa.",
      initialCode: `class Professor {
    String nome;
    Professor(String nome) { this.nome = nome; }
}

class Departamento {
    String nome;
    Professor professor;
    
    Departamento(String nome) {
        this.nome = nome;
    }
}`,
      correctCode: `class Professor {
    String nome;
    Professor(String nome) { this.nome = nome; }
}

class Departamento {
    String nome;
    Professor professor;
    
    Departamento(String nome, Professor prof) {
        this.nome = nome;
        this.professor = prof;
    }
}`,
      validationRegex: /Departamento\s*\(\s*String\s+nome\s*,\s*Professor\s+prof\s*\)[\s\S]*this\.professor\s*=\s*prof/,
      hint: "Na agregação, o objeto parte é recebido externamente. Adicione 'Professor prof' como parâmetro do construtor e faça 'this.professor = prof;'.",
      errorSimulated: "Lógico: O atributo 'professor' permanece null porque nunca é atribuído. A agregação requer receber a referência externa."
    },
    {
      id: "ex-45",
      title: "Concretização de Métodos de Interface",
      difficulty: "Médio",
      category: "Associação",
      instructions: "A classe `Carro` compromete-se a seguir as especificações da interface `Autoveloz`. No entanto, ela falha em compilar porque não cumpre o contrato estabelecido. Descubra qual é a pendência e adicione o método com a assinatura e o corpo adequados à classe `Carro`.",
      initialCode: `interface Autoveloz {
    void acelerar();
}

class Carro implements Autoveloz {
}`,
      correctCode: `interface Autoveloz {
    void acelerar();
}

class Carro implements Autoveloz {
    public void acelerar() {
        System.out.println("Acelerando!");
    }
}`,
      validationRegex: /public\s+void\s+acelerar\s*\(\s*\)\s*\{/,
      hint: "Quando uma classe implementa uma interface, ela deve implementar todos os métodos abstratos. Adicione 'public void acelerar() { ... }' dentro de Carro.",
      errorSimulated: "error: Carro is not abstract and does not override abstract method acelerar() in Autoveloz"
    },
    {
      id: "ex-46",
      title: "Tipo de Dados de Coleções Associadas",
      difficulty: "Difícil",
      category: "Associação",
      instructions: "A classe `Escola` deve manter uma coleção de objetos do tipo `Aluno` matriculados. O código atual apresenta um erro de compilação porque a coleção foi parametrizada com o tipo de dado incorreto. Ajuste o tipo genérico da coleção para aceitar o cadastro de alunos.",
      initialCode: `import java.util.ArrayList;

class Aluno {
    String nome;
    Aluno(String nome) { this.nome = nome; }
}

class Escola {
    ArrayList<String> alunos = new ArrayList<>();
    
    void matricular(Aluno a) {
        alunos.add(a);
    }
}`,
      correctCode: `import java.util.ArrayList;

class Aluno {
    String nome;
    Aluno(String nome) { this.nome = nome; }
}

class Escola {
    ArrayList<Aluno> alunos = new ArrayList<>();
    
    void matricular(Aluno a) {
        alunos.add(a);
    }
}`,
      validationRegex: /ArrayList\s*<\s*Aluno\s*>\s+alunos/,
      hint: "A lista deve armazenar objetos do tipo Aluno, não String. Corrija o genérico: 'ArrayList<Aluno>'.",
      errorSimulated: "error: incompatible types: Aluno cannot be converted to String\n        alunos.add(a);\n                   ^"
    },
    {
      id: "ex-47",
      title: "Gerenciamento de Ciclo de Vida em Composição",
      difficulty: "Difícil",
      category: "Associação",
      instructions: "Para modelar uma relação de composição estrita entre `Casa` e `Sala`, a existência da sala deve depender inteiramente da casa, ou seja, ela deve ser instanciada internamente no construtor da classe `Casa` a partir de uma medida de área recebida. Altere o construtor para refletir essa dependência direta.",
      initialCode: `class Sala {
    double area;
    Sala(double area) { this.area = area; }
}

class Casa {
    Sala sala;
    
    Casa(Sala sala) {
        this.sala = sala;
    }
}`,
      correctCode: `class Sala {
    double area;
    Sala(double area) { this.area = area; }
}

class Casa {
    Sala sala;
    
    Casa(double areaSala) {
        this.sala = new Sala(areaSala);
    }
}`,
      validationRegex: /this\.sala\s*=\s*new\s+Sala\s*\(\s*areaSala\s*\)/,
      hint: "Na composição, o todo é responsável por criar a parte. Receba apenas os dados primitivos (double areaSala) e crie 'new Sala(areaSala)' internamente.",
      errorSimulated: "Design: Ao receber Sala por parâmetro, você modela agregação (independência). Na composição, Casa deve criar Sala internamente."
    },
    // ==================== POLIMORFISMO (ex-48 a ex-53) ====================
    {
      id: "ex-48",
      title: "Acesso a Métodos Específicos de Subclasse",
      difficulty: "Médio",
      category: "Polimorfismo",
      instructions: "Um objeto da subclasse `Gato` foi instanciado sob uma referência mais genérica da superclasse `Animal`. Ao tentar acionar o comportamento de miar, o compilador não reconhece a ação a partir da referência genérica. Ajuste a chamada de método realizando a conversão de tipo apropriada (downcasting) de modo seguro.",
      initialCode: `class Animal {
    void comer() { System.out.println("Comendo..."); }
}
class Gato extends Animal {
    void miar() { System.out.println("Miau!"); }
}

public class Teste {
    public static void main(String[] args) {
        Animal animal = new Gato();
        animal.miar();
    }
}`,
      correctCode: `class Animal {
    void comer() { System.out.println("Comendo..."); }
}
class Gato extends Animal {
    void miar() { System.out.println("Miau!"); }
}

public class Teste {
    public static void main(String[] args) {
        Animal animal = new Gato();
        ((Gato) animal).miar();
    }
}`,
      validationRegex: /\(\s*\(\s*Gato\s*\)\s*animal\s*\)\s*\.\s*miar\s*\(\s*\)/,
      hint: "Use casting para acessar métodos da subclasse: '((Gato) animal).miar();'.",
      errorSimulated: "error: cannot find symbol\n        animal.miar();\n              ^\n  symbol:   method miar()\n  location: variable animal of type Animal"
    },
    {
      id: "ex-49",
      title: "Restrição de Visibilidade na Sobrescrita",
      difficulty: "Difícil",
      category: "Polimorfismo",
      instructions: "A classe `Filho` está sobrescrevendo o comportamento de `falar` herdado da classe `Pai`. Porém, a declaração na subclasse viola uma regra de herança referente à restrição de visibilidade do método. Corrija o modificador de acesso na subclasse para restabelecer a compatibilidade.",
      initialCode: `class Pai {
    public void falar() { System.out.println("Olá"); }
}

class Filho extends Pai {
    void falar() { System.out.println("Oi"); }
}`,
      correctCode: `class Pai {
    public void falar() { System.out.println("Olá"); }
}

class Filho extends Pai {
    public void falar() { System.out.println("Oi"); }
}`,
      validationRegex: /class\s+Filho\s+extends\s+Pai\s*\{[\s\S]*public\s+void\s+falar\s*\(\s*\)/,
      hint: "Na sobrescrita, a visibilidade do método na subclasse NÃO pode ser mais restritiva que na superclasse. Se o pai é public, o filho também deve ser public.",
      errorSimulated: "error: falar() in Filho cannot override falar() in Pai\n  attempting to assign weaker access privileges; was public"
    },
    {
      id: "ex-50",
      title: "Aplicação Prática de Polimorfismo",
      difficulty: "Fácil",
      category: "Polimorfismo",
      instructions: "Para aplicar o princípio do polimorfismo de forma adequada, permitindo maior flexibilidade no código, a variável que aponta para o objeto real desenhado deve ser declarada com o tipo da superclasse. Modifique a declaração da variável na classe `Teste` para que ela use o tipo abstrato/genérico correspondente.",
      initialCode: `class Forma {
    void desenhar() { System.out.println("Desenhando forma"); }
}

class Circulo extends Forma {
    void desenhar() { System.out.println("Desenhando círculo"); }
}

public class Teste {
    public static void main(String[] args) {
        Circulo forma = new Circulo();
        forma.desenhar();
    }
}`,
      correctCode: `class Forma {
    void desenhar() { System.out.println("Desenhando forma"); }
}

class Circulo extends Forma {
    void desenhar() { System.out.println("Desenhando círculo"); }
}

public class Teste {
    public static void main(String[] args) {
        Forma forma = new Circulo();
        forma.desenhar();
    }
}`,
      validationRegex: /Forma\s+forma\s*=\s*new\s+Circulo\s*\(\s*\)/,
      hint: "Para polimorfismo, use o tipo da superclasse na declaração: 'Forma forma = new Circulo();'. O método executado será o do Circulo (objeto real).",
      errorSimulated: "Conceitual: Sem polimorfismo, você perde a flexibilidade de trocar a subclasse sem alterar o restante do código."
    },
    {
      id: "ex-51",
      title: "Compatibilidade de Assinaturas de Sobrescrita",
      difficulty: "Difícil",
      category: "Polimorfismo",
      instructions: "Na classe `Filho`, a intenção é sobrescrever o método `calcular` herdado de `Pai`. No entanto, a assinatura do método na subclasse não corresponde exatamente à da superclasse, fazendo com que a anotação `@Override` aponte um erro de compilação. Ajuste os tipos dos parâmetros do método para efetivar a sobrescrita.",
      initialCode: `class Pai {
    int calcular(int x) { return x * 2; }
}

class Filho extends Pai {
    @Override
    int calcular(double x) { return (int)(x * 3); }
}`,
      correctCode: `class Pai {
    int calcular(int x) { return x * 2; }
}

class Filho extends Pai {
    @Override
    int calcular(int x) { return x * 3; }
}`,
      validationRegex: /@Override\s+int\s+calcular\s*\(\s*int\s+x\s*\)/,
      hint: "Para sobrescrever corretamente, a assinatura do método (nome + tipos de parâmetros) deve ser idêntica. Troque 'double x' por 'int x'.",
      errorSimulated: "error: method does not override or implement a method from a supertype\n    @Override\n    ^"
    },
    {
      id: "ex-52",
      title: "Ligação Dinâmica versus Ligação Estática",
      difficulty: "Difícil",
      category: "Polimorfismo",
      instructions: "O programa tenta utilizar polimorfismo dinâmico para chamar o método `exibir` adequado a partir da instância real do objeto. No entanto, a declaração atual vincula o método à classe em tempo de compilação em vez de em tempo de execução. Remova a palavra-chave que impede a ligação dinâmica das chamadas de método.",
      initialCode: `class Base {
    static void exibir() { System.out.println("Base"); }
}

class Derivada extends Base {
    static void exibir() { System.out.println("Derivada"); }
}

public class Teste {
    public static void main(String[] args) {
        Base obj = new Derivada();
        obj.exibir();
    }
}`,
      correctCode: `class Base {
    void exibir() { System.out.println("Base"); }
}

class Derivada extends Base {
    void exibir() { System.out.println("Derivada"); }
}

public class Teste {
    public static void main(String[] args) {
        Base obj = new Derivada();
        obj.exibir();
    }
}`,
      validationRegex: /class\s+Base\s*\{[\s\S]*void\s+exibir\s*\(\s*\)[\s\S]*class\s+Derivada[\s\S]*void\s+exibir\s*\(\s*\)/,
      hint: "Métodos static são vinculados ao tipo da referência (ligação estática). Remova 'static' para que o polimorfismo dinâmico funcione.",
      errorSimulated: "Conceitual: obj.exibir() imprime 'Base' em vez de 'Derivada' porque métodos static usam ligação estática, não dinâmica."
    },
    {
      id: "ex-53",
      title: "Implementação de Classe Abstrata Concreta",
      difficulty: "Médio",
      category: "Polimorfismo",
      instructions: "A classe `Retangulo` herda de uma superclasse abstrata que estabelece um contrato para o cálculo de área. Para que `Retangulo` possa ser instanciada como uma classe concreta, ela precisa prover a lógica específica desse cálculo. Forneça o corpo e a fórmula de cálculo correspondentes para satisfazer essa exigência de compilação.",
      initialCode: `abstract class Forma {
    abstract double area();
}

class Retangulo extends Forma {
    double largura = 10;
    double altura = 5;
}`,
      correctCode: `abstract class Forma {
    abstract double area();
}

class Retangulo extends Forma {
    double largura = 10;
    double altura = 5;
    
    double area() {
        return largura * altura;
    }
}`,
      validationRegex: /double\s+area\s*\(\s*\)\s*\{\s*return\s+largura\s*\*\s*altura\s*;\s*\}/,
      hint: "Classes concretas que estendem classes abstratas devem implementar todos os métodos abstratos. Adicione 'double area() { return largura * altura; }'.",
      errorSimulated: "error: Retangulo is not abstract and does not override abstract method area() in Forma"
    }
  ],
  glossary: [
    { term: "Classe", definition: "Modelo (blueprint) que define a estrutura (atributos) e o comportamento (métodos) de um grupo de objetos. Reside na Metaspace da JVM.", relatedConcept: "Classe" },
    { term: "Objeto", definition: "Instância concreta de uma classe, criada com o operador 'new'. Ocupa espaço real na memória Heap.", relatedConcept: "Objeto" },
    { term: "Instância", definition: "Sinônimo de objeto. Cada instância possui sua própria cópia dos atributos de instância da classe.", relatedConcept: "Objeto" },
    { term: "Referência", definition: "Variável que armazena o endereço de memória de um objeto na Heap. Fica alocada na Stack.", relatedConcept: "Objeto" },
    { term: "Atributo", definition: "Variável declarada no corpo da classe que armazena o estado de cada instância. Também chamado de variável de instância ou campo.", relatedConcept: "Atributo" },
    { term: "Variável Local", definition: "Variável declarada dentro de um método ou bloco. Não possui valor padrão e deve ser inicializada antes do uso.", relatedConcept: "Atributo" },
    { term: "Método", definition: "Bloco de código que define um comportamento da classe. Possui assinatura (nome + parâmetros), tipo de retorno e corpo.", relatedConcept: "Método" },
    { term: "Heap", definition: "Região da memória onde os objetos são alocados dinamicamente pelo operador 'new'. Gerenciada pelo Garbage Collector.", relatedConcept: "Objeto" },
    { term: "Stack", definition: "Região da memória que armazena variáveis locais, referências e frames de métodos. Segue a estrutura LIFO (Last In, First Out).", relatedConcept: "Objeto" },
    { term: "Encapsulamento", definition: "Princípio de POO que protege os dados internos de um objeto, expondo-os apenas através de métodos públicos (getters/setters).", relatedConcept: "Visibilidade" },
    { term: "Abstração", definition: "Princípio de POO que consiste em modelar apenas os aspectos essenciais e relevantes de um objeto do mundo real, ocultando detalhes complexos.", relatedConcept: "Classe" },
    { term: "Interface", definition: "Tipo de referência que define um contrato de comportamento (métodos abstratos). Uma classe pode implementar múltiplas interfaces com 'implements'.", relatedConcept: "Herança" },
    { term: "super", definition: "Palavra-chave que referencia a superclasse. Usada para chamar o construtor do pai (super()), ou acessar métodos/atributos da superclasse.", relatedConcept: "Herança" },
    { term: "this", definition: "Palavra-chave que referencia o objeto atual (a própria instância). Usada para desambiguar atributos de parâmetros e chamar outros construtores.", relatedConcept: "Construtor" },
    { term: "new", definition: "Operador que aloca memória na Heap para um novo objeto e invoca o construtor da classe correspondente.", relatedConcept: "Objeto" },
    { term: "extends", definition: "Palavra-chave usada para declarar que uma classe herda de outra (herança simples). Ex: 'class Filho extends Pai'.", relatedConcept: "Herança" },
    { term: "implements", definition: "Palavra-chave usada para declarar que uma classe implementa uma ou mais interfaces. Ex: 'class Carro implements Dirigivel'.", relatedConcept: "Herança" },
    { term: "@Override", definition: "Anotação que indica que um método está sobrescrevendo um método da superclasse. Causa erro de compilação se a assinatura não coincidir.", relatedConcept: "Polimorfismo" },
    { term: "NullPointerException", definition: "Exceção lançada em tempo de execução quando se tenta acessar um membro (atributo ou método) de uma referência que aponta para null.", relatedConcept: "Objeto" },
    { term: "Construtor", definition: "Método especial com o mesmo nome da classe e sem tipo de retorno. Chamado automaticamente pelo operador 'new' para inicializar o estado do objeto.", relatedConcept: "Construtor" },
    { term: "Sobrecarga (Overload)", definition: "Definir múltiplos métodos com o mesmo nome mas parâmetros diferentes na mesma classe. Resolvida em tempo de compilação.", relatedConcept: "Método" },
    { term: "Sobrescrita (Override)", definition: "Redefinir na subclasse um método herdado da superclasse mantendo a mesma assinatura. Resolvida em tempo de execução (polimorfismo dinâmico).", relatedConcept: "Polimorfismo" },
    { term: "Composição", definition: "Tipo forte de associação 'tem um' onde a parte não existe sem o todo. O todo é responsável por criar e destruir suas partes.", relatedConcept: "Associação" },
    { term: "Agregação", definition: "Tipo fraco de associação 'tem um' onde a parte pode existir independentemente do todo. A parte é recebida por referência externa.", relatedConcept: "Associação" },
    { term: "static", definition: "Modificador que indica que um membro pertence à classe (não à instância). Atributos static são compartilhados por todos os objetos. Métodos static não acessam membros de instância diretamente.", relatedConcept: "Atributo" },
    { term: "final", definition: "Modificador que impede alteração: 'final class' não pode ser estendida, 'final method' não pode ser sobrescrito, 'final variable' não pode ser reatribuída.", relatedConcept: "Atributo" },
    { term: "Upcasting", definition: "Conversão implícita de uma referência de subclasse para o tipo da superclasse. Ex: Animal a = new Cachorro(); (sempre seguro).", relatedConcept: "Polimorfismo" },
    { term: "Downcasting", definition: "Conversão explícita de uma referência de superclasse para o tipo da subclasse. Ex: Cachorro c = (Cachorro) a; (pode lançar ClassCastException).", relatedConcept: "Polimorfismo" }
  ],
  reviewCards: [
    {
      id: "classe",
      title: "Classe",
      keyPoints: [
        "Classe é o blueprint/molde que define atributos (estado) e métodos (comportamento).",
        "Declarada com a palavra-chave 'class'. O nome segue PascalCase.",
        "Reside na Metaspace (Área de Métodos) da JVM, não ocupa Heap sozinha.",
        "Pode ser: concreta, abstrata (abstract) ou final (não extensível).",
        "Cada arquivo .java pode ter no máximo UMA classe pública."
      ],
      codeSnippet: `public class Carro {
    String modelo;       // Atributo
    void acelerar() {}   // Método
}`
    },
    {
      id: "objeto",
      title: "Objeto",
      keyPoints: [
        "Objeto é a instância concreta de uma classe, criado com o operador 'new'.",
        "Alocado na Heap; a variável de referência fica na Stack.",
        "Referência null + acesso a membro = NullPointerException.",
        "Duas referências podem apontar para o mesmo objeto (aliasing).",
        "Cada objeto possui sua própria cópia dos atributos de instância."
      ],
      codeSnippet: `Carro c1 = new Carro();  // c1 aponta para objeto na Heap
Carro c2 = c1;           // c2 aponta para o MESMO objeto
Carro c3 = null;         // c3 não aponta para nada`
    },
    {
      id: "atributo",
      title: "Atributo",
      keyPoints: [
        "Atributos de instância têm valores padrão: 0, 0.0, false, null.",
        "Variáveis locais NÃO têm valor padrão (erro de compilação se usadas sem inicializar).",
        "Atributos 'static' pertencem à classe, não às instâncias.",
        "Atributos 'final' são constantes — não podem ser reatribuídos.",
        "Use 'this.atributo' para desambiguar de parâmetros com mesmo nome."
      ],
      codeSnippet: `class Conta {
    double saldo;             // Instância (padrão: 0.0)
    static int total = 0;    // Classe (compartilhado)
    final String BANCO = "X"; // Constante
}`
    },
    {
      id: "metodo",
      title: "Método",
      keyPoints: [
        "Assinatura: [visibilidade] [static] tipoRetorno nomeMetodo(parâmetros).",
        "Métodos com retorno diferente de void DEVEM ter instrução 'return'.",
        "Sobrecarga (overload): mesmo nome, parâmetros diferentes, mesma classe.",
        "Métodos static não acessam membros de instância diretamente.",
        "Chamadas de método sempre usam parênteses: obj.metodo()."
      ],
      codeSnippet: `public double somar(double a, double b) {
    return a + b;  // Obrigatório: tipo de retorno double
}
void exibir() {    // void: sem return de valor
    System.out.println("Olá");
}`
    },
    {
      id: "visibilidade",
      title: "Modificadores de Visibilidade",
      keyPoints: [
        "private: apenas a própria classe.",
        "default (sem modificador): classes do mesmo pacote.",
        "protected: mesmo pacote + subclasses (mesmo de outros pacotes).",
        "public: qualquer classe de qualquer pacote.",
        "Encapsulamento: atributos private + getters/setters públicos."
      ],
      codeSnippet: `public class Conta {
    private double saldo;         // Protegido
    public double getSaldo() {    // Acesso controlado
        return this.saldo;
    }
    public void setSaldo(double s) {
        if (s >= 0) this.saldo = s; // Validação
    }
}`
    },
    {
      id: "construtor",
      title: "Construtor",
      keyPoints: [
        "Mesmo nome da classe + sem tipo de retorno (nem void!).",
        "Chamado automaticamente pelo operador 'new'.",
        "Se nenhum construtor definido → Java cria construtor padrão vazio.",
        "Se qualquer construtor personalizado existir → padrão desaparece.",
        "super() e this() devem ser a PRIMEIRA instrução do construtor."
      ],
      codeSnippet: `public class Livro {
    String titulo;
    Livro() { this("Sem Título"); }     // Delega para outro construtor
    Livro(String t) { this.titulo = t; } // Construtor principal
}
// new Livro() → titulo = "Sem Título"
// new Livro("Java") → titulo = "Java"`
    },
    {
      id: "heranca",
      title: "Herança",
      keyPoints: [
        "Modela relação 'é um'. Subclasse extends Superclasse.",
        "Java suporta APENAS herança simples de classes (um único extends).",
        "Membros public e protected são herdados; private NÃO.",
        "Interfaces são implementadas com 'implements' (múltiplas permitidas).",
        "Use 'super' para acessar membros da superclasse ou chamar seu construtor."
      ],
      codeSnippet: `class Animal {
    protected String nome;
    void comer() { System.out.println("Comendo"); }
}
class Cachorro extends Animal {
    void latir() { System.out.println("Au!"); }
    // Herda: nome, comer()
}`
    },
    {
      id: "associacao",
      title: "Associação",
      keyPoints: [
        "Modela relação 'tem um' entre objetos.",
        "Associação Simples: relação livre entre dois objetos independentes.",
        "Agregação: todo/parte com ciclo de vida INDEPENDENTE (parte recebida por parâmetro).",
        "Composição: todo/parte com ciclo de vida DEPENDENTE (parte criada internamente).",
        "Implementada como atributo de referência a outro objeto."
      ],
      codeSnippet: `// COMPOSIÇÃO: Casa cria Sala
class Casa {
    Sala sala;
    Casa() { this.sala = new Sala(); } // Ciclo dependente
}
// AGREGAÇÃO: Time recebe Jogador
class Time {
    Jogador goleiro;
    Time(Jogador j) { this.goleiro = j; } // Ciclo independente
}`
    },
    {
      id: "polimorfismo",
      title: "Polimorfismo",
      keyPoints: [
        "Permite tratar objetos de subclasses via referência da superclasse.",
        "Tipo da referência → quais métodos podem ser chamados (compilação).",
        "Objeto real (Heap) → qual versão do método executa (execução).",
        "Sobrescrita (@Override): mesma assinatura, subclasse redefine comportamento.",
        "Visibilidade na sobrescrita NÃO pode ser mais restritiva que no pai."
      ],
      codeSnippet: `Animal a = new Cachorro();  // Upcasting
a.emitirSom();   // Executa versão de Cachorro (dinâmico)
// a.latir();     // ERRO: Animal não tem latir()
((Cachorro) a).latir(); // OK: Downcasting explícito`
    }
  ]
};

// Exportando os dados se o ambiente suportar Node/ES Modules, senão anexamos ao window
if (typeof module !== 'undefined' && module.exports) {
  module.exports = pooData;
} else {
  window.pooData = pooData;
}
