import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const VariantsComponent = () => {
    const [variants, setVariants] = useState([]);

    const addVariant = () => {
        if (variants.length < 3) {
            setVariants(prev => [...prev, {
                id: uuidv4(),
                optionName: 'size',
                optionVal: [''],
                isDone: false
            }]);
        }
    };

    const handleOptionName = (e, variantId) => {
        const { value } = e.target;
        setVariants(prevVariants => {
            return prevVariants.map(variant => {
                if (variant.id === variantId) {
                    return { ...variant, optionName: value };
                }
                return variant;
            });
        });
    };

    const handleOptionVal = (e, id) => {

    }

    console.log(variants)
    return (
        <div className='newVariant'>
            <div className=''>
                {variants.map((eachVar, i) =>
                    eachVar.isDone ?
                        <span key={i}>{eachVar.optionName}</span>
                        :
                        <div key={eachVar.id}>
                            <label htmlFor={eachVar.id}>Option name</label>
                            <select
                                id={eachVar.id}
                                value={eachVar.optionName}
                                onChange={(e) => handleOptionName(e, eachVar.id)}
                            >
                                <option value="size">Size</option>
                                <option value="color">Color</option>
                                <option value="material">Material</option>
                                <option value="flavour">Flavour</option>
                            </select>
                        </div>
                )}
            </div>
            <div>
                {
                    variants.map((eachVariant, i) => eachVariant.isDone ? eachVariant.optionVal.map((eachVal, i) =>
                        <span key={i}>{eachVal}</span>) :
                        <div key={i}>
                            <input type='text' onChange={(e) => handleOptionVal(eachVariant.id)} value={ } />
                        </div>)
                }
            </div>
            <button onClick={addVariant}>+ Add another option</button>
        </div>
    );
};

export default VariantsComponent;
