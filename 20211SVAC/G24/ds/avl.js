class Node{
	constructor(data=null){
		this.data=data;
		this.left=null;
		this.right=null;
		this.h=1;
	}
}

class avl{

	add(elem){
			this.root=this.insert(this.root,elem);
	}

	remove(elem){
		this.root=this.del(this.root,elem);
	}

	insert(node,elem){
		if(node==null){
			return new Node(elem);
		}else if(elem < node.data){
			node.left = this.insert(node.left,elem);
		}else{
			node.right = this.insert(node.right,elem);
		}

		node.h = 1 + this.max(this.getH(node.left),this.getH(node.right));
		var balance = this.getBalance(node);
		
		if(balance > 1 && elem < node.left.data){
			return this.Rrot(node);
		}

		if(balance < -1 && elem > node.right.data){
			return this.Lrot(node);
		}

		if(balance > 1 && elem > node.left.data){
			node.left = this.Lrot(node.left);
			return this.Rrot(node);
		}

		if(balance < -1 && elem < node.right.data){
			node.right = this.Rrot(node.right);
			return this.Lrot(node);
		}
		return node;
	}

	
	del(node,elem){
		if(node==null){
			return node;
		}else if(elem < node.data){
			node.left = this.del(node.left,elem);
		}else if(elem > node.data){
			node.right = this.del(node.right,elem);
		}else{
			if (node.left==null){
				var tmp = node.right;
				node=null;
				return tmp;
			}else if(node.right==null){
				var tmp = node.left;
				node=null;
				return tmp;
			}
			var tmp = this.maxLeft(node.left);
			node.data = tmp.data
			node.left=this.del(node.left,tmp.data);
		}
		if (node==null){
			return node;
		}
		node.h = 1 + this.max(this.getH(node.left),this.getH(node.right));
		var balance = this.getBalance(node);
		if (balance > 1 && this.getBalance(node.left) >= 0){
			return this.Rrot(node);
		} 
		if(balance < -1 && this.getBalance(node.right) <= 0){
			return this.Lrot(node);
		}
		if(balance > 1 && this.getBalance(node.left) < 0){
			node.left = this.Lrot(node.left);
			return this.Rrot(node);
		}

		if(balance <-1 && self.getBalance(node.right)>0){
			node.right=this.Rrot(node.right);
			return this.Lrot(node);
		}
	return node;

	}

	
	search(elem,node=this.root){
		if (node==null){
			return null;
		}else if(data < node.data){
			return this.search(elem,node.left);
		}else if(data > node.data){
			return this.search(elem,node.right);
		}else{
			return node;
		}
	}

	maxLeft(node){
		var curr=node;
		while(curr.right!=null){
			curr=curr.right;
		}
		return curr;
	}
	
	max(x,y){
		if (x>y){
			return x;
		}
		return y;
	}

	getH(node){
		if (node==null){
			return 0;
		}
		return node.h;
	}

	getBalance(node){
		if (node==null){
			return 0;
		}
		return (this.getH(node.left) - this.getH(node.right));
	}
	
	Lrot(node){
        let aux = node.right;
        let T = aux.left;
		aux.left = node;
        node.right = T;
        node.h = 1 + this.max(this.getH(node.right), this.getH(node.left));
        aux.h = 1 + this.max(this.getH(aux.left),this.getH(aux.right));
        return aux;	
	}

	Rrot(node){
        let aux = node.left;
        let T = aux.right;
		aux.right = node;
        node.left = T;
        node.h = 1 + this.max(this.getH(node.right), this.getH(node.left));
        aux.h = 1 + this.max(this.getH(aux.left),this.getH(aux.right));
        return aux;
	}


	printInorder(node=this.root){
		if(node!=null){
			this.printInorder(node.left);
			console.log(node.data);
			this.printInorder(node.right);
		}
	}

	printPreorder(node=this.root){
		if(node!=null){
			console.log(node.data);
			this.printPreorder(node.left);
			this.printPreorder(node.right);
		}
	}

	printPostorder(node=this.root){
		if(node!=null){
			this.printPostorder(node.left);
			this.printPostorder(node.right);
			console.log(node.data);
		}
		
	}	

}

