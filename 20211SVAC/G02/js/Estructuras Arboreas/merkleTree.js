var arrayNodes = []
var edges = []
var contador = 1
var clickedNode
var index
var clickedNodoValue
var network = null

class NodoBloque{
    constructor(valor, id){
        this.valor = valor
        this.id = id
    }
}
class NodoHash{
    constructor(valor, id){
        this.valor = valor
        this.izq = null
        this.der = null
        this.id = id
    }
}

class ArbolDeMerkle{
    constructor(){
        this.repetidos = false
        this.raiz = null
        this.claves = []
    }

    agregar(valor){
        contador++
        this.claves.push(new NodoBloque(valor, contador))
        this.reorganizar()

    }

    buscarNodo(valor){
        for(var i = 0; i < this.claves.length; i++){
            if(this.claves[i].valor == valor){
                return this.claves[i].id
            }
        }
        return -1
    }

    buscar(valor){
        for(var i = 0; i < this.claves.length; i++){
            if(this.claves[i].valor == valor){
                return true
            }
        }
        return false
    }

    reorganizar(){
        var arreglo = []
        for(var i = 0; i < this.claves.length; i++){
            if(this.claves[i].valor != this.claves[i].id.toString(2)){
                arreglo.push(this.claves[i])
            }
        }
        this.claves = arreglo
    }

    eliminar(id, valor){
        var arreglo = []
        for(var i = 0; i < this.claves.length; i++){
            if(this.claves[i].valor != valor && this.claves[i].valor != this.claves[i].id.toString(2) && this.claves[i].id != id){
                arreglo.push(this.claves[i])
            }
        }
        this.claves = arreglo
    }

    actualizar(id, valor, valorNuevo){
        for(var i = 0; i < this.claves.length; i++){
            if(this.claves[i].valor == valor && this.claves[i].id == id){
                this.claves[i].valor = valorNuevo
            }
        }
    }

    estructurar(){
        var exponente = 0
        for(exponente; Math.pow(2, exponente) < this.claves.length; exponente++){}
        var tamanio = this.claves.length
        for(tamanio; tamanio < Math.pow(2, exponente);tamanio++){
            contador++
            this.claves.push(new NodoBloque(contador.toString(2),contador))
        }
        index = Math.pow(2, exponente)
        this.crearArbol(exponente)
        this.llenarArbol(this.raiz, Math.pow(2, exponente))
    }

    crearArbol(exponente){
        contador++
        this.raiz = new NodoHash(0, contador)
        this._crearArbol(this.raiz, exponente)
    }

    _crearArbol(temp, exponente){
        if(exponente>0){
            contador++
            temp.izq = new NodoHash(0, contador)
            contador++
            temp.der = new NodoHash(0, contador)
            this._crearArbol(temp.izq, exponente - 1)
            this._crearArbol(temp.der, exponente - 1)
        }
    }
    llenarArbol(temp, cantidad){
        if (temp != null) {
            this.llenarArbol(temp.izq, cantidad)
            this.llenarArbol(temp.der, cantidad)
            
            if (temp.izq == null && temp.der == null) {
              temp.izq = this.claves[cantidad-index--]
              temp.valor = (temp.izq.valor*1000).toString(16)
            } else {
              temp.valor = (parseInt(temp.izq.valor, 16)+parseInt(temp.der.valor, 16)).toString(16)
            }      
          }
    }

    recorrerGraficar(temp){
        if(temp != null){
            this.recorrerGraficar(temp.izq)
            arrayNodes.push({id: temp.id, label: temp.valor.toString(), shape: "box"})
            if(temp.izq != null){
                edges.push({from: temp.id, to: temp.izq.id})
            }
            if(temp.der != null){
                edges.push({from: temp.id, to: temp.der.id})
            }
            this.recorrerGraficar(temp.der)
        }
    }
}
let arbolbb = new ArbolDeMerkle()

function actualizarTablero(){
    arbolbb.recorrerGraficar(arbolbb.raiz);
    var nodes = new vis.DataSet(arrayNodes);
    var container = document.getElementById("mynetwork");
    var data = {
        nodes: nodes,
        edges: edges,
    };
    var options = { 
        physics: false,
        layout: {
            hierarchical: {
                direction: 'UD',
                nodeSpacing: 150,
                sortMethod : 'directed'
              }
        } 
    };
    network = new vis.Network(container, data, options);
    network.on('click', function (properties) {
        var nodeID = properties.nodes[0];
        if (nodeID) {
            clickedNode = this.body.nodes[nodeID];
            clickedNode = clickedNode.options.id
            console.log('clicked node:', clickedNode);
            clickedNodoValue =  this.body.nodes[nodeID]
            clickedNodoValue = clickedNodoValue.options.label
            document.getElementById("valueNodo").value = clickedNodoValue;
        }
    });
    arrayNodes = []
    edges = []  
}

function insertarNodo(){
    var valor = document.getElementById("valueNodo").value;
    arbolbb.agregar(valor)
    document.getElementById("valueNodo").value = ""
    arbolbb.estructurar()
    actualizarTablero()
}

function eliminarNodo(){
    if(clickedNodoValue != undefined){
        arbolbb.eliminar(clickedNode, clickedNodoValue)
        arbolbb.estructurar()
        actualizarTablero()
    }else{
        alert("Seleccione un nodo")
    }
    document.getElementById("valueNodo").value = ""
}

function actualizarNodo(){
    var valor = document.getElementById("valueNodo").value
    document.getElementById("valueNodo").value = ""
    if(clickedNodoValue != undefined){
        arbolbb.actualizar(clickedNode, clickedNodoValue, valor)
        }else{
            alert("Seleccione un nodo")
        }
    arbolbb.estructurar()
    actualizarTablero()
}

function searchNode(){
    var valor = document.getElementById("valueNodo").value;
    if(arbolbb.buscar(valor)){
        focus()
        setTimeout(zoomExtended, 2000)
    }else{
        alert("El dato no se encuentra dentro del arbol")
    }
    document.getElementById("valueNodo").value = ""
}


function focus() {
    var valueNodo = document.getElementById("valueNodo").value;
    let nodeId = arbolbb.buscarNodo(valueNodo)
    document.getElementById("valueNodo").value = ""
    var options = {
        scale: 3.0,
        offset: {x:0,y:0},
        animation: {
            duration: 2500,
            easingFunction: "easeOutQuint"
        }
    }
    network.focus(nodeId, options);
}

function zoomExtended(){
    var options = {
        scale: 1.0,
        duration: 4500,
        offset: {x:0,y:0},
        easingFunction: "easeOutCubic"
    }

    network.moveTo(options);
}