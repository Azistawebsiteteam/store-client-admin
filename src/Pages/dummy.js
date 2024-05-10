/* variant.sub.map((va, subIndex) => (
                                                        <div className='subVariantsOutputValbar' key={va.id}>
                                                            <div className='variantImgCont'>
                                                                {(va.variantImage || variant.main.variantImage) ?
                                                                    (


                                                                        va.variantImage ?


                                                                            (typeof va.variantImage === 'string' ? (<img src={va.variantImage} className="vImg" alt="variantImge" />)
                                                                                :
                                                                                (va.variantImage instanceof Blob ?
                                                                                    <img src={URL.createObjectURL(va.variantImage)} className="vImg" alt="" />
                                                                                    : <FaRegFileImage className='variantImgFile' />)
                                                                                    (variant.main.variantImage instanceof Blob ?
                                                                                        <img src={URL.createObjectURL(variant.main.variantImage)} className="vImg" alt="" />
                                                                                        : <FaRegFileImage className='variantImgFile' />)


                                                                            ) : <FaRegFileImage className='variantImgFile' />

                                                                    )

                                                                    : (<FaRegFileImage className='variantImgFile' />)
                                                                }

                                                                {location.pathname === "/product/create" ? (<Button variant="light" onClick={() => setVariantShow(true)}><span onClick={() => handleVariantClick(va.id)}>{va.value}</span></Button>) : (va.variantId !== 0 ? <Link to={`/variant-details/${va.variantId}`}> <span>{va.value}</span></Link> : <Button variant="light" onClick={() => setVariantShow(true)}><span onClick={() => handleVariantClick(va.id)}>{va.value}</span></Button>)}


                                                                {modalVariantId === va.id && (<VariantEdit mainId={variant.id} subId={va.id} handlevariantsvalues={handleVariantsvalues}
                                                                    show={modalVariantId === va.id}
                                                                    onHide={handleModalClose} />)}

                                                                <input type='file' id='variantImage' className='variantImgInput'
                                                                    onChange={(e) => handleVariantsImage(e, variant.id, '', va.id)} />
                                                            </div>

                                                            <div>
                                                                <input type="text" id='amount' placeholder="₹ 0.0" onChange={(e) => handleVariantsOutput(e, variant.id, '', va.id)} value={va.amount} />
                                                            </div>
                                                            <div>
                                                                <input type="text" id='quantity' onChange={(e) => handleVariantsOutput(e, variant.id, '', va.id)} value={va.quantity} />
                                                            </div>
                                                        </div>
                                                    )) */