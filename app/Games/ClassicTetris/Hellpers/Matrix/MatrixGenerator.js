export default class MatrixGenerator {
    constructor(size) {

    }

    getEmptySquareMatrix(size){
        return this.getEmptyMatrix(size, size);
    }

    getEmptyMatrix(row, col){
        return (new Array(row)).fill(null).map((el)=> el = (new Array(col)).fill(null));
    }
}