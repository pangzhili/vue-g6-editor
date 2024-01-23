import customNode from './customNode';
import textCardNode from "./textCardNode";
import tableNode from "@/components/Flow/registerNode/TableNode";
import trendNode from "@/components/Flow/registerNode/trendNode";

export default function registerNode() {
    customNode();
    textCardNode();
    tableNode();
    trendNode();
}