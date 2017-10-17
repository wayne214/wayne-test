
class ObjectUitls {
    isOwnEmpty(obj)
    {
     　　for(var name in obj)
    　　{
    　　　　if(obj.hasOwnProperty(name))
    　　　　{
    　　　　　　return false;//返回false，不为空对象
    　　　　}
　　}
　　return true;//返回true，为空对象
    };
}

const instance = new ObjectUitls();

export default instance;
