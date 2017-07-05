import * as Synaptic from "synaptic";

interface JSONRede {
}

export default class AG {
    public static criarIndividuo() {
        let rede = new Synaptic.Architect.Perceptron(1, 5, 2);
        return rede;
    }
}
