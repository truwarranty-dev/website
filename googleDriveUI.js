const googDiv = document.getElementById("googleDrive");
var arrayPath = [googDiv.dataset.folder];
var ascending = true;
var textIcons = false;
var primary = '#090909';
var secondary = '#222222';
var tertiary = '#B12127';
var iconColor = 'white';
var fontStyle = "'Roboto', sans-serif";

//Bugs

//interface functions
//search through visible files for those whose innerText matches the user input
function searchActivate() {
    if (window.innerWidth < 768) {
        if (inputBox.style.display !== 'none') {
            inputBox.style.display = 'none';
            filepath.style.display = 'flex';
            fileSearch.style.width = '60%';
            fileSearch.style.justifyContent = 'flex-end';
        } else {
            inputBox.style.display = 'block';
            filepath.style.display = 'none';
            fileSearch.style.width = '100%';
            fileSearch.style.justifyContent = 'space-between';
        };
    };
};
function searchFiles(input) {
    var filesSearch = files.getElementsByClassName('goog-drive-file');
    for (i = 0; i < filesSearch.length; i++) {
        if (input === '') {
            filesSearch[i].style.display = 'flex';
        } else {
            if (!textIcons) {
                const fileSelector = filesSearch[i].getElementsByClassName('file-selector');
                if (filesSearch[i].id.toLowerCase().includes(input.toLowerCase())) {
                    filesSearch[i].style.display = 'flex';
                    fileSelector[0].style.display = 'block';
                } else {
                    filesSearch[i].style.display = 'none';
                    fileSelector[0].checked = false;
                    fileSelector[0].style.display = 'none';
                };
            } else {
                    const fileSelector = filesSearch[i].getElementsByClassName('t-file-selector');
                if (filesSearch[i].id.toLowerCase().includes(input.toLowerCase())) {
                    filesSearch[i].style.display = 'flex';
                    fileSelector[0].style.display = 'block';
                } else {
                    filesSearch[i].style.display = 'none';
                    fileSelector[0].checked = false;
                    fileSelector[0].style.display = 'none';
                };
            }
        };
    };
};
//change file order from ascending to descending or vice-versa
function reorderFiles(num, response = 0) {
    //Sort ascending if ascending value is true
    switch(num) {
        case 1:
            ascending = !ascending;
            filesToArrange = Array.prototype.slice.call(files.getElementsByClassName('goog-drive-file'));

            if (ascending) {
                fileOrderIcon.setAttribute('class', 'fa-sharp fa-solid fa-arrow-down-wide-short fa-lg');
                fileOrderIconDrop.setAttribute('class', 'fa-sharp fa-solid fa-arrow-down-wide-short fa-2xl drop-element');
                filesToArrange.sort((a, b) => {
                    if (a.id && b.id) {
                        return a.id.toLowerCase() > b.id.toLowerCase() ? 1: -1;
                    };
                    return 0;
                }).forEach((val) => {
                    files.appendChild(val)
                });
            } else {
                fileOrderIcon.setAttribute('class', 'fa-sharp fa-solid fa-arrow-up-wide-short fa-lg');
                fileOrderIconDrop.setAttribute('class', 'fa-sharp fa-solid fa-arrow-up-wide-short fa-2xl drop-element');
                filesToArrange.sort((a, b) => {
                    if (a.id && b.id) {
                        return a.id.toLowerCase() < b.id.toLowerCase() ? 1: -1;
                    };
                }).forEach((val) => {
                    files.appendChild(val)
                });
                return 0;
            };
            return;
        case 2:
            if (ascending) {
                response.sort((a, b) => {
                    if (a.name && b.name) {
                        return a.name.toLowerCase() > b.name.toLowerCase() ? 1: -1;
                    };
                    return 0;
                });
            } else {
                response.sort((a, b) => {
                    if (a.name && b.name) {
                        return a.name.toLowerCase() < b.name.toLowerCase() ? 1: -1;
                    };
                    return 0;
                });
            };
            return response;
        default:
            console.error('unexpected num val passed');
    };
};
//change file visual representation
function explorerView(num = 0) {
    const viewImage = Array.prototype.slice.call(files.getElementsByClassName('file-selector'));
    const viewText = Array.prototype.slice.call(files.getElementsByClassName('t-file-selector'));
    const bodFlex = Array.prototype.slice.call(files.getElementsByClassName('bodFlex'));
    const selDivText = Array.prototype.slice.call(files.getElementsByClassName('selDivText'));
    const fileBox = Array.prototype.slice.call(files.getElementsByClassName('goog-drive-file'));
    const footFlex = Array.prototype.slice.call(files.getElementsByClassName('footFlex'));
    const nameDiv = Array.prototype.slice.call(files.getElementsByClassName('name-div'));
    const iconDiv = Array.prototype.slice.call(files.getElementsByClassName('icon-div'));


    if (num === 1) {
        textIcons = !textIcons;
    }

    if (selectAll.checked === true) {
        selectAll.click();
    };

    if (selectAllDrop.checked === true) {
        selectAllDrop.click();
    };

    viewImage.forEach((box) => {
        if (box.checked === true) {
            box.click();
        };
    });
    viewText.forEach((box) => {
        if (box.checked === true) {
            box.click();
        };
    });

    if (textIcons) {
        bodFlex.forEach((body) => {
            body.style.display = 'none';
        });
        selDivText.forEach((selDiv) => {
            selDiv.style.display = '';
        });
        fileBox.forEach((box) => {
            box.style.height = '50px';
            box.style.width = '100%';
        });
        footFlex.forEach((box) =>{
            box.style.height = '100%';
            box.style.zIndex = '';
        });
        nameDiv.forEach((box) => {
            box.style.marginLeft = '10px';
        });
        iconDiv.forEach((box) => {
            box.style.marginRight = '10px';
        });

    } else {
        bodFlex.forEach((body) => {
            body.style.display = '';
        });
        selDivText.forEach((selDiv) => {
            selDiv.style.display = 'none';
        });
        fileBox.forEach((box) => {
            box.style.height = '250px';
            box.style.width = '220px';
        });
        footFlex.forEach((box) =>{
            box.style.zIndex = '3'
            if (window.innerWidth < 768) {
                box.style.height = '35%';
            } else {
                box.style.height = '20%'
            }
        });
        nameDiv.forEach((box) => {
            box.style.marginLeft = '5px';
        });
        iconDiv.forEach((box) => {
            box.style.marginRight = '5px';
        });    };
};
//Remove files then regrab jsonResponse from google drive and apply fresh data
function refreshFiles() {
    while (files.firstChild) {
        files.removeChild(files.firstChild);
    };

    inputBox.value = '';

    GetDriveInfo(arrayPath[arrayPath.length - 1], 2);
};
//set all files to be selected or unselected
function selectFiles(id, num = 0) {
    const inputBox = document.getElementById(id);
    inputBox.click(); 

    var checkState = inputBox.checked;
    if (!textIcons) {
        var togChecks = files.getElementsByClassName('file-selector');
    } else {
        var togChecks = files.getElementsByClassName('t-file-selector');
    }

    if (checkState === true) {
        //toggle on all checkboxes on screen
        for (const box of togChecks) {
            if ((box.checked === false)) {
                box.click();
            };
        };

    } else if (checkState === false) {
        //toggle off all visible checkboxes
        for (const box of togChecks) {
            if ((box.checked === true)) {
                box.click();
            };
        };
    };
};
//control visual aspect of checkbox
function checkVis(check) {
    var str = check.id.slice(0, check.id.length-6);
    const inputMark = document.getElementById(`${str}-mark`);
    const inputSpan = document.getElementById(`${str}-span`);
    if (inputMark && inputSpan) {
        if (check.checked) {
            inputMark.style.display = 'block';
            inputSpan.style.backgroundColor = tertiary;
            inputSpan.style.border = `1px solid ${tertiary}`;
        } else {
            inputMark.style.display = 'none';
            inputSpan.style.backgroundColor = '#d3d3d380';
            inputSpan.style.border = `1px solid #292929`;
        };
    };

    setDownAccess();
};
function fileToggle(select) {
    var str = select.id.slice(0, select.id.length-5);
    const input = document.getElementById(`${str}-input`);
    if (input) {
        input.click();
        checkVis(input);
    };
};
//Enables download button when at least one file checked else disables
function setDownAccess() {
    if (!textIcons) {
        var togChecks = files.getElementsByClassName('file-selector');
    } else {
        var togChecks = files.getElementsByClassName('t-file-selector');
    }

    for (var check of togChecks) {
        if (check.checked) {
            //enable download
            downloadButton.disabled = false;
            downloadButton.style.backgroundColor = tertiary;
            downloadButton.style.cursor = 'pointer';
            break;
        } else {
            //disable download button
            downloadButton.disabled = true;
            downloadButton.style.backgroundColor = 'transparent';           
            downloadButton.style.cursor = '';
        };
    };
};
//Set the filepath in the header
function setFilepath(id, num, foldID, name) {
    var folderArray = Array.prototype.slice.call(filepath.getElementsByClassName('folder'));
    var mobileArray = Array.prototype.slice.call(filepath.getElementsByClassName('mobile-folder'));
    switch (num) {
        case 1:
            //Remove everything after current folder in filepath if name exists in path
            for (var i = (parseInt(foldID)); i < folderArray.length - 1; i++) {
                arrayPath.pop();
                if(filepath.lastElementChild !== null) {
                    filepath.removeChild(filepath.lastElementChild);
                    filepath.removeChild(filepath.lastElementChild);
                    filepath.removeChild(filepath.lastElementChild);                                      
                } else {
                    break;
                };
            };
            break;
        case 2:
            //Append new folder to filepath
            arrayPath.push(id);

            const slashPath = document.createElement('p');
            filepath.appendChild(slashPath);
            slashPath.setAttribute('class', 'slash gdui-desktop');
            slashPath.innerText = '/';
            
            const newPath = document.createElement('p');
            filepath.appendChild(newPath);
            newPath.setAttribute('id', folderArray.length);
            newPath.setAttribute('class', 'folder gdui-desktop');
            newPath.innerText = ' ' + name + ' ';
            newPath.setAttribute('onclick', `folderChange('${id}', 1, this.id, this.innerText)`);
            newPath.style.whiteSpace = 'pre';
            newPath.style.cursor = 'pointer';

            const mobilePath = document.createElement('p');
            filepath.appendChild(mobilePath);
            mobilePath.setAttribute('class', 'mobile-folder');
            mobilePath.innerText = name;

            if (window.innerWidth >=  1024) {
                slashPath.style.display = 'flex';
                newPath.style.display = 'flex';
                mobilePath.style.display = 'none';
            } else {
                slashPath.style.display = 'none';
                newPath.style.display = 'none';
                mobilePath.style.display = 'flex';
            };

            mobileArray.forEach((path, index) => {
                if (index !== mobileArray.length) {
                    path.style.display = 'none';
                };
            });


            break;
        default:
            console.error('Failed to set filepath');
    };

    var pathArray = Array.from(filepath.children);
    for (var i = 0; i < pathArray.length; i++) {
        if (i >= (pathArray.length - 2)) {
            pathArray[i].style.color = tertiary;
            pathArray[i].style.fontWeight = '700';
        } else {
            pathArray[i].style.color = '#ffffff80'
            pathArray[i].style.fontWeight = '50';
        }
    };
};
//change accessed folder
function folderChange(id, num, foldID = 0, name = '') {
    inputBox.value = '';
    //change filepath
    setFilepath(id, num, foldID, name);

    //remove on screen folders and files
    while (folders.firstChild) {
        folders.removeChild(folders.firstChild);
    };
    while (files.firstChild) {
        files.removeChild(files.firstChild);
    };
    //clear search (do this later)
    GetDriveInfo(arrayPath[foldID], 1);
};
//Go back to previous folder
function folderBack() {
    const pathing = Array.prototype.slice.call(filepath.getElementsByClassName('folder'));
    if (arrayPath.length > 1) {
        const lastPath = pathing[pathing.length - 2];
        
        //change folder and set filepath
        lastPath.click();
        
    };
};
//open the file in a different window
function openFile(link, num = 0) {
    window.open(link, '_blank');
};
//hover effect for folders and files
function hoverEffect(el, num) { 
    switch (num) {
        case 1:
            const elFoot = el.getElementsByClassName('footFlex');
            const pdfIcon = el.getElementsByClassName('pdf-icon');
            
            if (elFoot[0].style.backgroundColor === 'rgb(23, 23, 23)') {
                el.style.zIndex = '10'
                elFoot[0].style.backgroundColor = tertiary;
                pdfIcon[0].style.color = iconColor;
                if (!textIcons) {
                    el.style.transform = 'scale(1.1)';
                } else {
                    el.style.transform = 'scale(1.05)';
                }
            } else {
                el.style.zIndex = '';
                elFoot[0].style.backgroundColor = '#171717';
                pdfIcon[0].style.color = tertiary;
                el.style.transform = '';

            }
            break;
        case 2:
            if (el.style.backgroundColor === 'rgb(23, 23, 23)') {
                el.style.backgroundColor = tertiary;
                el.style.transform = 'scale(1.08)';
            } else {
                el.style.backgroundColor = '#171717';
                el.style.transform = '';
            }
            break;
        default:
            console.error('Hover effect failed to execute.')
            
    }
};
//hover effects for icons
function icoHovEffect(el, num, reIco = false, selDiv = false) {
    switch (num) {
        case 1:
            if (reIco === true) {
                if (refresh.style.transform === 'rotate(0deg)') {
                    const timer = ms => new Promise(res => setTimeout(res, ms))
                    async function anim() {
                        for (var i = 1; i < 360;) {
                            refresh.style.transform =  `rotate(${i}deg)`;
                            await timer(1);
                            i = i + 4;
                        }
                        refresh.style.transform = 'rotate(0deg)';
                    }
                    anim();
                };
            };

            if ((el.id !== magGlassIcon.id) || ((el.id === magGlassIcon.id) && (window.innerWidth < 768))) {
                if (selDiv === true) {
                    selectLabel.style.color = `#989898`;
                } else {
                    el.style.color = `#989898`;
                };
            }

            break;
        case 2:
            if (selDiv === true) {
                selectLabel.style.color = iconColor;
            } else {
                el.style.color = iconColor;
            };

            break;
        default:
            console.error('Failed to initiate hover effect');
    }
};
//hover effect for download button
function downHov(num) {
    switch (num) {
        case 1:
            downloadButton.style.color = iconColor;
            break;
        case 2:
            downloadButton.style.color = '#ffffff80';
            break;
        default:
            console.error('Hover effect on download button failed');
    }
};
//download multiple files from google drive
async function downloadMulti() {
    if (!textIcons) {
        var filesToDownload = files.getElementsByClassName('file-selector');
    } else {
        var filesToDownload = files.getElementsByClassName('t-file-selector');
    }
    for (let i = 0; i < filesToDownload.length; i++) {
        if (filesToDownload[i].checked && (filesToDownload[i].style.display !== 'none')) {
            const urlForFile = 'https://www.googleapis.com/drive/v3/files/' + filesToDownload[i].value + 
                '?alt=media&key=' + googDiv.dataset.apikey;
            const fileName = filesToDownload[i].id.slice(0, filesToDownload[i].id.length - 6);

            xhrRequest();
            async function xhrRequest() {
                try {
                    xhr[i] = new XMLHttpRequest();
                    xhr[i].responseType = 'blob';
                    xhr[i].open("GET", urlForFile, true);
                    xhr[i].onload = () => {
                        const b = document.createElement('a'); 
                        b.href = window.URL.createObjectURL(xhr[i].response); 
                        b.download = fileName;
                        b.style.display = 'none';
                        document.body.appendChild(b);
                        b.click();
                        b.remove();
                    };
                    await xhr[i].send(null);
                } catch (error) {
                    console.error('Download request failed with error: ', error);
                }
            };
        };
    };
};
//download a single file from google drive
async function downloadSingle(id, name) {
    const urlForFile = 'https://www.googleapis.com/drive/v3/files/' + id + 
                '?alt=media&key=' + googDiv.dataset.apikey;
    try {
        xhr = new XMLHttpRequest();
        xhr.open("GET", urlForFile);
        xhr.responseType = 'blob';
        xhr.onload = () => {
            const b = document.createElement('a'); 
            b.href = window.URL.createObjectURL(xhr.response); 
            b.download = name;
            b.style.display = 'none';
            document.body.appendChild(b);
            b.click();
        }
        await xhr.send(null);
    } catch (error) {
        console.error('Download request failed with error: ', error);
    };
}
function dropDownEnd(event) {
    if (!event.target.classList.contains('drop-element')) {
        const dropmenus = Array.prototype.slice.call(document.getElementsByClassName('dropmenu'));
        dropmenus.forEach((val) => {
            if (val.style.display !== 'none') {
                val.style.display = 'none';
            };
        });
    window.removeEventListener('click', dropDownEnd);
    };
};
//activate dropdown menu
function dropClick(fileName) {
    const targetDropMenu = document.getElementById(`${fileName}-dropmenu`);

    if (targetDropMenu.style.display === 'none') {
        targetDropMenu.style.display = 'flex';
        window.addEventListener('click', dropDownEnd);
    } else {
        targetDropMenu.style.display = 'none';
    };
};
//Get folders and files from Google Drive and create html tags for them
function setFolders(jsonResponse) {
    var googFolders = [];
    jsonResponse.files.forEach((val) => {
        if (val.mimeType === 'application/vnd.google-apps.folder') {
            googFolders.push(val);
        }
    });

    if (arrayPath.length > 1) {
        const backFold = document.createElement('div');
        folders.appendChild(backFold);
        backFold.setAttribute('onclick', `folderBack()`);
        backFold.setAttribute('onmouseenter', 'hoverEffect(this, 2)');
        backFold.setAttribute('onmouseleave', 'hoverEffect(this, 2)');
        backFold.setAttribute('class', 'goog-folder');
        backFold.style.width = '215px';
        backFold.style.maxWidth = '215px';
        backFold.style.marginRight = '20px';
        backFold.style.marginBottom = '20px';
        backFold.style.backgroundColor = '#171717';
        backFold.style.cursor = 'pointer';
        backFold.style.boxShadow = `0px 0px 10px 4px rgb(0 0 0 / 88%)`;
        backFold.style.fontSize = '12px';
        backFold.style.transition = 'all .2s ease-in-out';
        backFold.style.color = '#ffffff80';
        backFold.style.fontWeight = '500';

            const deskVersion = document.createElement('div');
            backFold.appendChild(deskVersion);
            deskVersion.setAttribute('class', 'gdui-desktop gdui-tablet');
            deskVersion.style.display = 'flex';
            deskVersion.style.justifyContent = 'space-between';
            deskVersion.style.alignItems = 'center';

                const backVis = document.createElement('div');
                deskVersion.appendChild(backVis);
                backVis.style.display = 'flex';
                backVis.style.justifyContent = 'center';
                backVis.style.alignItems = 'center';
                backVis.style.paddingLeft = '10px';

                    const backArrow = document.createElement('i');
                    backVis.appendChild(backArrow);
                    backArrow.setAttribute('class', 'fa-solid fa-sharp fa-arrow-left fa-2xl');
                    backArrow.style.color = '#292929';

                    const prevFold = document.createElement('p');
                    backVis.appendChild(prevFold);
                    prevFold.innerText = 'Previous Folder';
                    prevFold.style.marginLeft = '10px';

            const mobVersion = document.createElement('div')
            backFold.appendChild(mobVersion);
            mobVersion.setAttribute('class', 'gdui-mobile');
            mobVersion.style.display = 'none';
            mobVersion.style.flexDirection = 'column';
            mobVersion.style.justifyContent = 'space-between';
            mobVersion.style.alignItems = 'center';

                const arrowDiv = document.createElement('div');
                mobVersion.appendChild(arrowDiv);
                arrowDiv.style.marginTop = '10px';
                arrowDiv.style.color = '#292929';
                arrowDiv.style.fontSize = '4em';
                
                    const backArrowM = document.createElement('i');
                    arrowDiv.appendChild(backArrowM);
                    backArrowM.setAttribute('class', 'fa-solid fa-sharp fa-arrow-left');

                const prevFoldM = document.createElement('p');
                mobVersion.appendChild(prevFoldM);
                prevFoldM.innerText = 'Previous Folder';
                prevFoldM.style.marginLeft = '10px';
    };

    for (const folder of googFolders) {
        const folderViewer = document.createElement('div');
        folders.appendChild(folderViewer);
        folderViewer.setAttribute('onclick', `folderChange('${folder.id}', 2, ${arrayPath.length}, '${folder.name}')`);
        folderViewer.setAttribute('class', 'goog-folder');
        folderViewer.setAttribute('onmouseenter', 'hoverEffect(this, 2)');
        folderViewer.setAttribute('onmouseleave', 'hoverEffect(this, 2)');
        folderViewer.style.width = '215px';
        folderViewer.style.maxWidth = '215px';
        folderViewer.style.marginRight = '20px';
        folderViewer.style.marginBottom = '20px';
        folderViewer.style.backgroundColor = '#171717';
        folderViewer.style.cursor = 'pointer';
        folderViewer.style.boxShadow = `0px 0px 10px 4px rgb(0 0 0 / 88%)`;
        folderViewer.style.fontSize = '12px';
        folderViewer.style.transition = 'all .2s ease-in-out';

            const desktopVer = document.createElement('div');
            folderViewer.appendChild(desktopVer);
            desktopVer.setAttribute('class', 'deskVer gdui-desktop gdui-tablet');
            desktopVer.style.display = 'flex';
            desktopVer.style.justifyContent = 'space-between';
            desktopVer.style.alignItems = 'center';

                const folderInfo = document.createElement('div');
                desktopVer.appendChild(folderInfo);
                folderInfo.style.display = 'flex';
                folderInfo.style.justifyContent = 'center';
                folderInfo.style.alignItems = 'center';
                folderInfo.style.paddingLeft = '10px';

                    const folderIcon = document.createElement('i');
                    folderInfo.appendChild(folderIcon);
                    folderIcon.setAttribute('class', 'fa-solid fa-sharp fa-folder-closed fa-2xl');
                    folderIcon.style.color = '#292929';

                    const foldName = document.createElement('p');
                    folderInfo.appendChild(foldName);
                    foldName.innerText = folder.name;
                    foldName.style.marginLeft = '10px';

                const openIcon = document.createElement('i');
                desktopVer.appendChild(openIcon);
                openIcon.setAttribute('class', 'fa-sharp fa-solid fa-chevron-down');
                openIcon.style.paddingRight = '10px';

            const mobileVer = document.createElement('div')
            folderViewer.appendChild(mobileVer);
            mobileVer.setAttribute('class', 'mobileVer gdui-mobile');
            mobileVer.style.display = 'none';
            mobileVer.style.flexDirection = 'column';
            mobileVer.style.justifyContent = 'space-between';
            mobileVer.style.alignItems = 'center';

                const folderIconDiv = document.createElement('div');
                mobileVer.appendChild(folderIconDiv);
                folderIconDiv.style.marginTop = '10px';
                folderIconDiv.style.color = '#292929';
                folderIconDiv.style.fontSize = '4em';
                
                    const folderIconM = document.createElement('i');
                    folderIconDiv.appendChild(folderIconM);
                    folderIconM.setAttribute('class', 'fa-solid fa-sharp fa-folder-closed');

                const folderInfoM = document.createElement('div');
                mobileVer.appendChild(folderInfoM);
                folderInfoM.style.display = 'flex';
                folderInfoM.style.justifyContent = 'space-around';
                folderInfoM.style.alignItems = 'center';
                folderInfoM.style.paddingLeft = '10px';
                folderInfoM.style.width = '100%';

                    const foldNameM = document.createElement('p');
                    folderInfoM.appendChild(foldNameM);
                    foldNameM.innerText = folder.name;
                    foldNameM.style.marginLeft = '10px';

                    const openIconM = document.createElement('i');
                    folderInfoM.appendChild(openIconM);
                    openIconM.setAttribute('class', 'fa-sharp fa-solid fa-chevron-down');
    };

};
function setFiles(jsonResponse) {
    var googFiles = [];
    jsonResponse.files.forEach((val) => {
        if (val.mimeType !== 'application/vnd.google-apps.folder') {
            googFiles.push(val);
        };
    });
    var ordGoogFiles = reorderFiles(2, googFiles);

    for (const file of ordGoogFiles) {
        const fileViewer = document.createElement('div');
        files.appendChild(fileViewer);
        fileViewer.setAttribute('class', 'goog-drive-file');
        fileViewer.setAttribute('onmouseenter', 'hoverEffect(this, 1)');
        fileViewer.setAttribute('onmouseleave', 'hoverEffect(this, 1)');
        fileViewer.setAttribute('id', file.name);
        fileViewer.style.display = 'flex';
        fileViewer.style.flexDirection = 'column';
        fileViewer.style.transition = 'all .2s ease-in-out';
        fileViewer.style.height = '250px';
        fileViewer.style.width = '215px';
        fileViewer.style.marginRight = '20px';
        fileViewer.style.marginBottom = '20px';
        fileViewer.style.backgroundColor = secondary;
        fileViewer.style.boxShadow = `0px 0px 10px 4px rgb(0 0 0 / 88%)`;
        fileViewer.style.fontSize = '12px';

            const bodFlex = document.createElement('div');
            fileViewer.appendChild(bodFlex);
            bodFlex.setAttribute('class', 'bodFlex');
            bodFlex.style.height = '80%';

                const previewImage = document.createElement('img');
                bodFlex.appendChild(previewImage);
                previewImage.setAttribute('src', file.thumbnailLink);
                previewImage.setAttribute('onclick', `openFile('${file.webViewLink}')`);
                previewImage.style.cursor = 'pointer';
                previewImage.style.zIndex = '1';
                previewImage.style.position = 'absolute';
                previewImage.style.maxWidth = '215px';
                previewImage.style.minHeight = '200px';
                previewImage.style.width = '100%';
                previewImage.style.maxHeight = '250px';


                const selectorDiv = document.createElement('div');
                bodFlex.appendChild(selectorDiv);
                selectorDiv.style.zIndex = '2';
                selectorDiv.style.position = 'relative';
                selectorDiv.style.float = 'right';
                selectorDiv.style.marginTop = '10px';
                selectorDiv.style.marginRight = '10px';
                selectorDiv.style.cursor = 'pointer';

                    const fileSelectorCheck = document.createElement('i');
                    selectorDiv.appendChild(fileSelectorCheck);
                    fileSelectorCheck.setAttribute('id', `${file.name}-mark`);
                    fileSelectorCheck.setAttribute('onclick', `fileToggle(this)`);
                    fileSelectorCheck.setAttribute('class', 'fa-sharp fa-solid fa-check fa-sm');
                    fileSelectorCheck.style.display = 'none';
                    fileSelectorCheck.style.position = 'absolute';
                    fileSelectorCheck.style.zIndex = '4';
                    fileSelectorCheck.style.marginTop = '9px';
                    fileSelectorCheck.style.marginLeft = '5px'
                    fileSelectorCheck.style.color = '#171717';

                    const fileSelectorSpan = document.createElement('span');
                    selectorDiv.appendChild(fileSelectorSpan);
                    fileSelectorSpan.setAttribute('id', `${file.name}-span`);
                    fileSelectorSpan.setAttribute('onclick', `fileToggle(this)`);
                    fileSelectorSpan.style.height = '17px';
                    fileSelectorSpan.style.width = '17px';
                    fileSelectorSpan.style.backgroundColor = '#d3d3d380';
                    fileSelectorSpan.style.border = '1px solid #292929';
                    fileSelectorSpan.style.display = 'block';

                    const fileSelector = document.createElement('input');
                    bodFlex.appendChild(fileSelector);
                    fileSelector.setAttribute('class', 'file-selector');
                    fileSelector.setAttribute('type', 'checkbox');
                    fileSelector.setAttribute('id', `${file.name}-input`);
                    fileSelector.setAttribute('value', file.id);
                    fileSelector.setAttribute('onchange', 'checkVis(this)');
                    fileSelector.style.appearance = 'none';
                    fileSelector.style.display = 'block';
            
            const footFlex = document.createElement('div');
            fileViewer.appendChild(footFlex);
            footFlex.setAttribute('class', 'footFlex');
            footFlex.style.display = 'flex';
            footFlex.style.justifyContent = 'space-between';
            footFlex.style.alignItems = 'center';
            footFlex.style.height = '20%';
            footFlex.style.zIndex = '3';
            footFlex.style.padding = '0px 4px 0px 10px';
            footFlex.style.gap = '6px';
            footFlex.style.backgroundColor = '#171717';

                const nameDiv = document.createElement('div');
                footFlex.appendChild(nameDiv);
                nameDiv.setAttribute('class', 'name-div');
                nameDiv.style.display = 'flex';
                nameDiv.style.flexDirection = 'row';
                nameDiv.style.justifyContent = 'flex-start';
                nameDiv.style.alignItems = 'center';
                nameDiv.style.width = '70%';

                    const PDFIconDiv = document.createElement('div');
                    nameDiv.appendChild(PDFIconDiv);
                    PDFIconDiv.setAttribute('class', 'pdf-icon');
                    PDFIconDiv.style.marginTop = '4px';
                    PDFIconDiv.style.marginRight = '5px';
                    PDFIconDiv.style.width = '20px';
                    PDFIconDiv.style.color = tertiary;

                        const PDFIcon = document.createElement('i');
                        PDFIconDiv.appendChild(PDFIcon);

                        if (file.mimeType.includes('pdf')) {
                            PDFIcon.setAttribute('class', 'fa-sharp fa-solid fa-file-pdf fa-lg');

                        } else if (file.mimeType.includes('image')) {
                            PDFIcon.setAttribute('class', 'fa-sharp fa-solid fa-image fa-lg');

                        } else if (file.mimeType.includes('video')) {
                            PDFIcon.setAttribute('class', 'fa-sharp fa-solid fa-video fa-lg');

                        } else if (file.mimeType.includes('audio')) {
                            PDFIcon.setAttribute('class', 'fa-sharp fa-solid fa-music fa-lg');

                        } else {
                            PDFIcon.setAttribute('class', 'fa-sharp fa-solid fa-file fa-lg');
                        };

                    const driveFileName = document.createElement('p');
                    nameDiv.appendChild(driveFileName);
                    driveFileName.setAttribute('id', `n-${file.name}`);
                    driveFileName.setAttribute('class', 'drive-file-name');
                    driveFileName.innerText = file.name;
                    driveFileName.style.whiteSpace = 'nowrap';
                    driveFileName.style.overflow = 'hidden';
                    driveFileName.style.textOverflow = 'ellipsis';

                const iconDiv = document.createElement('div');
                footFlex.appendChild(iconDiv)
                iconDiv.setAttribute('class', 'icon-div');
                iconDiv.style.display = 'flex';
                iconDiv.style.flexDirection = 'row';
                iconDiv.style.justifyContent = 'center';
                iconDiv.style.alignItems = 'center';

                    const downloadFile = document.createElement('button');
                    iconDiv.appendChild(downloadFile);
                    downloadFile.setAttribute('onclick', `downloadSingle('${file.id}', '${file.name}')`);
                    downloadFile.setAttribute('class', 'gdui-desktop gdui-tablet');
                    downloadFile.style.height = '25px';
                    downloadFile.style.width = '25px';
                    downloadFile.style.border = 'none';
                    downloadFile.style.background = 'none';
                    downloadFile.style.color = iconColor;
                    downloadFile.style.cursor = 'pointer';
                    downloadFile.style.display = 'flex';
                    downloadFile.style.alignItems = 'center';

                        const downloadFileIcon = document.createElement('i');
                        downloadFile.appendChild(downloadFileIcon);
                        downloadFileIcon.setAttribute('class', 'fa-sharp fa-solid fa-download');
                        downloadFileIcon.setAttribute('onmouseenter', `icoHovEffect(this, 1)`);
                        downloadFileIcon.setAttribute('onmouseleave', `icoHovEffect(this, 2)`);

                    const printFile = document.createElement('button');
                    iconDiv.appendChild(printFile);
                    printFile.setAttribute('onclick', `openFile('${file.webViewLink}')`);
                    printFile.setAttribute('class', 'gdui-desktop gdui-tablet');
                    printFile.style.height = '25px';
                    printFile.style.width = '25px';
                    printFile.style.border = 'none';
                    printFile.style.background = 'none';
                    printFile.style.color = iconColor;
                    printFile.style.cursor = 'pointer';
                    printFile.style.display = 'flex';
                    printFile.style.alignItems = 'center';

                        const printFileIcon = document.createElement('i');
                        printFile.appendChild(printFileIcon);
                        printFileIcon.setAttribute('class', 'fa-sharp fa-solid fa-print');
                        printFileIcon.setAttribute('onmouseenter', `icoHovEffect(this, 1)`);
                        printFileIcon.setAttribute('onmouseleave', `icoHovEffect(this, 2)`);

                    const selDivText = document.createElement('div');
                    iconDiv.appendChild(selDivText);
                    selDivText.setAttribute('class', 'selDivText');
                    selDivText.style.zIndex = '2';
                    selDivText.style.position = 'relative';
                    selDivText.style.float = 'right';
                    selDivText.style.cursor = 'pointer';
                    selDivText.style.color = 'black';
                    selDivText.style.display = 'none';

                        const fileSelChkText = document.createElement('i');
                        selDivText.appendChild(fileSelChkText);
                        fileSelChkText.setAttribute('id', `t-${file.name}-mark`);
                        fileSelChkText.setAttribute('onclick', `fileToggle(this)`);
                        fileSelChkText.setAttribute('class', 'fa-sharp fa-solid fa-check fa-xs');
                        fileSelChkText.style.display = 'none';
                        fileSelChkText.style.position = 'absolute';
                        fileSelChkText.style.zIndex = '4';
                        fileSelChkText.style.marginTop = '8px';
                        fileSelChkText.style.marginLeft = '3px'

                        const fileSelSpText = document.createElement('span');
                        selDivText.appendChild(fileSelSpText);
                        fileSelSpText.setAttribute('id', `t-${file.name}-span`);
                        fileSelSpText.setAttribute('onclick', `fileToggle(this)`);
                        fileSelSpText.style.height = '17px';
                        fileSelSpText.style.width = '17px';
                        fileSelSpText.style.backgroundColor = 'gray';
                        fileSelSpText.style.display = 'block';
                        fileSelSpText.style.opacity = '0.5';
                        fileSelSpText.style.outlineColor = 'black';
                        fileSelSpText.style.outlineStyle = 'solid';
                        fileSelSpText.style.outlineWidth = 'thin';

                        const fileSelText = document.createElement('input');
                        iconDiv.appendChild(fileSelText);
                        fileSelText.setAttribute('class', 't-file-selector');
                        fileSelText.setAttribute('type', 'checkbox');
                        fileSelText.setAttribute('id', `t-${file.name}-input`);
                        fileSelText.setAttribute('value', file.id);
                        fileSelText.setAttribute('onchange', 'checkVis(this)');
                        fileSelText.style.display = 'none';
        
                    const dropDiv = document.createElement('div');
                    iconDiv.appendChild(dropDiv);
                    dropDiv.setAttribute('class', 'gdui-mobile drop-element');
                    dropDiv.style.display = 'none';

                        const dropdown = document.createElement('button');
                        dropDiv.appendChild(dropdown);
                        dropdown.setAttribute('class', 'drop-element');
                        dropdown.setAttribute('onclick', `dropClick('${file.name}')`);
                        dropdown.style.height = '25px';
                        dropdown.style.width = '25px';
                        dropdown.style.border = 'none';
                        dropdown.style.background = 'none';
                        dropdown.style.color = iconColor;
                        dropdown.style.cursor = 'pointer';
        
                            const dropdownIcon = document.createElement('i');
                            dropdown.appendChild(dropdownIcon);
                            dropdownIcon.setAttribute('class', 'fa-solid fa-ellipsis-vertical fa-xl drop-element');
                            dropdownIcon.setAttribute('onmouseenter', `icoHovEffect(this, 1)`);
                            dropdownIcon.setAttribute('onmouseleave', `icoHovEffect(this, 2)`);
    
                        const fileDropMenu = document.createElement('div');
                        dropDiv.appendChild(fileDropMenu);
                        fileDropMenu.setAttribute('id', `${file.name}-dropmenu`);
                        fileDropMenu.setAttribute('class', 'dropmenu drop-element');
                        fileDropMenu.style.display = 'none';
                        fileDropMenu.style.flexDirection = 'column';
                        fileDropMenu.style.position = 'absolute';
                        fileDropMenu.style.marginTop = '25px';
                        fileDropMenu.style.width = '40px';
                        fileDropMenu.style.backgroundColor = secondary;
                        fileDropMenu.style.zIndex = '5';

                            const dropDownload = document.createElement('button');
                            fileDropMenu.appendChild(dropDownload);
                            dropDownload.setAttribute('class', 'drop-element');
                            dropDownload.setAttribute('onclick', `downloadSingle('${file.id}', '${file.name}')`);
                            dropDownload.style.height = '25px';
                            dropDownload.style.width = '25px';
                            dropDownload.style.border = 'none';
                            dropDownload.style.background = 'none';
                            dropDownload.style.color = iconColor;
                            dropDownload.style.cursor = 'pointer';
                            dropDownload.style.margin = '5px';

                                const dropDownloadIcon = document.createElement('i');
                                dropDownload.appendChild(dropDownloadIcon);
                                dropDownloadIcon.setAttribute('class', 'fa-sharp fa-solid fa-download fa-xl drop-element');
                                dropDownloadIcon.setAttribute('onmouseenter', `icoHovEffect(this, 1)`);
                                dropDownloadIcon.setAttribute('onmouseleave', `icoHovEffect(this, 2)`);
        
                            const dropPrint = document.createElement('button');
                            fileDropMenu.appendChild(dropPrint);
                            dropPrint.setAttribute('id', `${file.name}-print`);
                            dropPrint.setAttribute('class', 'drop-element');
                            dropPrint.setAttribute('onclick', `openFile(${file.webViewLink})`);
                            dropPrint.style.height = '25px';
                            dropPrint.style.width = '25px';
                            dropPrint.style.border = 'none';
                            dropPrint.style.background = 'none';
                            dropPrint.style.color = iconColor;
                            dropPrint.style.margin = '5px';
                            dropPrint.style.cursor = 'pointer';
            
                                const dropPrintIcon = document.createElement('i');
                                dropPrint.appendChild(dropPrintIcon);
                                dropPrintIcon.setAttribute('class', 'fa-sharp fa-solid fa-print fa-xl drop-element');
                                dropPrintIcon.setAttribute('onmouseenter', `icoHovEffect(this, 1)`);
                                dropPrintIcon.setAttribute('onmouseleave', `icoHovEffect(this, 2)`);
            };
};
async function GetDriveInfo(desFolder, num) {
    const url = 'https://www.googleapis.com/drive/v3/files?q="' + desFolder + '"+in+parents&key=' + 
                googDiv.dataset.apikey + '&fields=files(id, name, mimeType, thumbnailLink, webViewLink)';
    try {
        xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.onload = function() {
            //use switch statements to sort through responses if GetDriveInfo() is used in multiple places
            const jsonResponse = JSON.parse(xhr.responseText);
                switch (num) {
                case 1: 
                    setFolders(jsonResponse);
                    setFiles(jsonResponse);
                    cssChange();
                    if (textIcons) {
                        explorerView();
                    };
                    break;
                case 2: 
                    setFiles(jsonResponse);
                    cssChange();
                    if (textIcons) {
                        explorerView();
                    };
                    break;
                default:
                    console.error('Failed to get data.');
            }
        };
        await xhr.send(null);
    } catch (error) {
        console.error('Failed to get files with error: ', error);
    };

    return 'done';
};

//CSS for computer screen
function ComputerCSS(desktopDivs, tabletDivs, mobileDivs, folderButtons, fileCard, pathing, footFlex, driveFileName) {
    
    tabletDivs.forEach((val) => {
        val.style.display = 'none';
    });
    mobileDivs.forEach((val) => {
        val.style.display = 'none';
    });    
    desktopDivs.forEach((val) => {
        val.style.display = 'flex';
    });

    googDiv.style.marginLeft = '10%';
    googDiv.style.marginRight = '10%';

    //UIHeader
    pathing.forEach((path) => {
        path.style.display = 'none';
    });

    //UIBody
    folderButtons.forEach((folder) => {
        folder.style.width = '215px';
    });
    fileCard.forEach ((file) => {
        if (!textIcons) {
            file.style.width = '215px';
        };
    });
    footFlex.forEach((footer) => {
        if (!textIcons) {
            footer.style.height = '20%';
        } else {
            footer.style.height = '100%';
        }    });
    driveFileName.forEach((fileName) => {
        fileName.style.whiteSpace = 'nowrap';
        fileName.style.overflow = 'hidden';
        fileName.style.textOverflow = 'ellipsis';
        fileName.style.height = '';
        fileName.style.display = '';
        fileName.style.alignItems = '';
        fileName.style.wordBreak = '';
        fileName.innerText = `${fileName.id.substring(2)}`;
    });

    input.style.height = '25px';
    magGlassIcon.setAttribute('class', 'fa-sharp fa-solid fa-magnifying-glass fa-lg');
    refreshIcon.setAttribute('class', 'fa-sharp fa-solid fa-rotate fa-lg');


    //UIFooter
    UIFooter.style.justifyContent = 'flex-end';
    UIFooter.style.paddingRight = '35px';

        downloadButton.style.width = '200px';
};
//CSS for tablet screen
function TabletCSS(desktopDivs, tabletDivs, mobileDivs, folderButtons, fileCard, pathing, footFlex, driveFileName) {

    desktopDivs.forEach((val) => {
        val.style.display = 'none'
    });
    mobileDivs.forEach((val) => {
        val.style.display = 'none'
    });
    tabletDivs.forEach((val) => {
        val.style.display = 'flex';
    });


    googDiv.style.marginLeft = '5%';
    googDiv.style.marginRight = '5%';

    //UIHeader
    pathing[pathing.length - 1].style.display = 'block'

    //UIBody
    folderButtons.forEach((folder) => {
        folder.style.width = '215px';
    });
    fileCard.forEach ((file) => {
        if (!textIcons) {
            file.style.width = '215px';
        };
    });
    footFlex.forEach((footer) => {
        if (!textIcons) {
            footer.style.height = '20%';
        } else {
            footer.style.height = '100%';
        }    });
    driveFileName.forEach((fileName) => {
        fileName.style.whiteSpace = 'nowrap';
        fileName.style.overflow = 'hidden';
        fileName.style.textOverflow = 'ellipsis';
        fileName.style.height = '';
        fileName.style.display = '';
        fileName.style.alignItems = '';
        fileName.style.wordBreak = '';
        fileName.innerText = `${fileName.id.substring(2)}`;
    });

    input.style.height = '35px';
        magGlassIcon.setAttribute('class', 'fa-sharp fa-solid fa-magnifying-glass fa-2xl');
    refreshIcon.setAttribute('class', 'fa-sharp fa-solid fa-rotate fa-2xl');


    //UIFooter
    UIFooter.style.justifyContent = 'flex-end';
    UIFooter.style.paddingRight = '35px';

        downloadButton.style.width = '200px';
};
//CSS for Phone Screen
function PhoneCSS(desktopDivs, tabletDivs, mobileDivs, folderButtons, fileCard, pathing, footFlex, driveFileName) {

    desktopDivs.forEach((val) => {
        val.style.display = 'none';
    });
    tabletDivs.forEach((val) => {
        val.style.display = 'none';
    });
    mobileDivs.forEach((val) => {
        val.style.display = 'flex';
    });

    googDiv.style.marginLeft = '1%';
    googDiv.style.marginRight = '1%';

    //UIHeader
    pathing[pathing.length - 1].style.display = 'block'


    //UIBody
    folderButtons.forEach((folder) => {
        folder.style.width = '46%';
    });
    fileCard.forEach ((file) => {
        if(!textIcons) {
        const fileImage = file.getElementsByTagName('img');
        file.style.width = '46%';
        fileImage[0].style.width = `${(files.offsetWidth * 0.46)}px`
        };
    });
    footFlex.forEach((footer) => {
        if (!textIcons) {
            footer.style.height = '35%';
        } else {
            footer.style.height = '100%';
        }
    });
    driveFileName.forEach((fileName) => {
        fileName.style.height = '50%';
        fileName.style.whiteSpace = '';
        fileName.style.overflow = '';
        fileName.style.textOverflow = '';
        fileName.style.display = 'flex';
        fileName.style.alignItems = 'center';
        fileName.style.wordBreak = 'break-word';
        if (fileName.id.length > 20) { 
            fileName.innerText = `${fileName.id.substring(2, 20) + '...'}`;
        }
    });

    input.style.height = '35px';
        magGlassIcon.setAttribute('class', 'fa-sharp fa-solid fa-magnifying-glass fa-2xl');
    
    refreshIcon.setAttribute('class', 'fa-sharp fa-solid fa-rotate fa-2xl');


    //UIFooter
    UIFooter.style.justifyContent = 'center';
    UIFooter.style.paddingRight = '0px';

        downloadButton.style.width = '95%';
};


//apply CSS to googleDrive div
googDiv.style.display = 'flex';
googDiv.style.flexDirection = 'column';
googDiv.style.outline = 'true';
googDiv.style.backgroundColor = primary;
googDiv.style.color = 'white';
googDiv.style.fontFamily = fontStyle;


//UI header
const uiHeader = document.createElement('div');
googDiv.appendChild(uiHeader);
uiHeader.setAttribute('id', 'ui-header');
uiHeader.style.display = 'flex';
uiHeader.style.alignItems = 'center';
uiHeader.style.marginTop = '10px';
uiHeader.style.marginBottom ='10px';
uiHeader.style.paddingLeft = '35px';
uiHeader.style.paddingRight = '35px';

    const filepath = document.createElement('div');
    uiHeader.appendChild(filepath);
    filepath.setAttribute('id', 'filepath');
    filepath.style.display = 'flex';
    filepath.style.flexDirection = 'row';
    filepath.style.alignItems = 'center';
    filepath.style.width = '40%';
    filepath.style.height = '50px';
    filepath.style.fontSize = '14px';
    
        const backBtn = document.createElement('button');
        filepath.appendChild(backBtn);
        backBtn.setAttribute('onclick', `folderBack()`);
        backBtn.setAttribute('class', 'gdui-mobile gdui-tablet');
        backBtn.style.background = 'none';
        backBtn.style.border = 'none';
        backBtn.style.color = iconColor;

            const backIcon = document.createElement('i');
            backBtn.appendChild(backIcon);
            backIcon.setAttribute('class', 'fa-sharp fa-solid fa-arrow-left fa-2xl');


        const homePath = document.createElement('p');
        filepath.appendChild(homePath);
        homePath.setAttribute('id', '0');
        homePath.setAttribute('class', 'folder gdui-desktop');
        homePath.setAttribute('onclick', `folderChange('${googDiv.dataset.folder}', 1, this.id, this.innerText)`);
        homePath.innerText = 'Home ';
        homePath.style.whiteSpace = 'pre';
        homePath.style.cursor = 'pointer';
        homePath.style.color = tertiary;
        homePath.style.fontWeight = '700';
        
        const mobileHome = document.createElement('p');
        filepath.appendChild(mobileHome);
        mobileHome.setAttribute('class', 'mobile-folder');
        mobileHome.innerText = 'Home';
        mobileHome.style.display = 'none';
        mobileHome.style.color = tertiary;
        homePath.style.fontWeight = '700';


    const fileSearch = document.createElement('div')
    uiHeader.appendChild(fileSearch);
    fileSearch.setAttribute('id', 'file-search');
    fileSearch.style.display = 'flex';
    fileSearch.style.flexDirection = 'row';
    fileSearch.style.justifyContent = 'flex-end';
    fileSearch.style.alignItems = 'center';
    fileSearch.style.marginRight = '5px';
    fileSearch.style.width = '60%';
    fileSearch.style.height = '50px';

        const searchDiv = document.createElement('div');
        fileSearch.appendChild(searchDiv);

            const input = document.createElement('div');
            searchDiv.appendChild(input);
            input.setAttribute('id', 'input');
            input.style.backgroundColor = secondary;
            input.style.display = 'flex';
            input.style.alignItems ='center';
            input.style.padding = '4px';

                const magButton = document.createElement('button');
                input.appendChild(magButton);
                magButton.setAttribute('onclick', 'searchActivate()');
                magButton.style.background = 'none';
                magButton.style.border = 'none';
                magButton.style.color = iconColor;
                magButton.style.height = '2.5em';

                    const magGlassIcon = document.createElement('i');
                    magButton.appendChild(magGlassIcon);
                    magGlassIcon.setAttribute('id', 'mag-ico');
                    magGlassIcon.setAttribute('class', 'fa-sharp fa-solid fa-magnifying-glass fa-lg');
                    magGlassIcon.setAttribute('onmouseenter', `icoHovEffect(this, 1)`);
                    magGlassIcon.setAttribute('onmouseleave', `icoHovEffect(this, 2)`);

                const inputBox = document.createElement('input');
                input.appendChild(inputBox);
                inputBox.setAttribute('id', 'input-box');
                inputBox.setAttribute('class', 'gdui-desktop gdui-tablet');
                inputBox.setAttribute('type', 'text');
                inputBox.setAttribute('onkeyup', 'searchFiles(this.value)');
                inputBox.setAttribute('placeholder', 'Search Filenames');
                inputBox.style.border = 'none';
                inputBox.style.outline = 'none';
                inputBox.style.background = 'transparent';
                inputBox.style.color = iconColor;

        const iconsDiv = document.createElement('div');
        fileSearch.appendChild(iconsDiv);
        iconsDiv.style.display = 'flex';
        iconsDiv.style.justifyContent = 'flex-end';
        iconsDiv.style.alignItems = 'center';

            const fileOrder = document.createElement('button');
            iconsDiv.appendChild(fileOrder);
            fileOrder.setAttribute('id', 'file-order');
            fileOrder.setAttribute('onclick', 'reorderFiles(1)');
            fileOrder.setAttribute('class', 'gdui-desktop')
            fileOrder.style.marginRight = '3px';
            fileOrder.style.marginLeft = '5px';
            fileOrder.style.border = 'none';
            fileOrder.style.background = 'none';
            fileOrder.style.color = iconColor;
            fileOrder.style.cursor = 'pointer';

                const fileOrderIcon = document.createElement('i');
                fileOrder.appendChild(fileOrderIcon);
                fileOrderIcon.setAttribute('class', 'fa-sharp fa-solid fa-arrow-down-wide-short fa-lg');
                fileOrderIcon.setAttribute('onmouseenter', `icoHovEffect(this, 1)`);
                fileOrderIcon.setAttribute('onmouseleave', `icoHovEffect(this, 2)`);

            const appearance = document.createElement('button');
            iconsDiv.appendChild(appearance);
            appearance.setAttribute('id', 'appearance');
            appearance.setAttribute('onclick', 'explorerView(1)');
            appearance.setAttribute('class', 'gdui-desktop')
            appearance.style.marginRight = '3px';
            appearance.style.border = 'none';
            appearance.style.background = 'none';
            appearance.style.color = iconColor;
            appearance.style.cursor = 'pointer';

                const appearanceIcon = document.createElement('i');
                appearance.appendChild(appearanceIcon);
                appearanceIcon.setAttribute('class', 'fa-solid fa-list fa-lg');
                appearanceIcon.setAttribute('onmouseenter', `icoHovEffect(this, 1)`);
                appearanceIcon.setAttribute('onmouseleave', `icoHovEffect(this, 2)`);

            const dropDiv = document.createElement('div');
            iconsDiv.appendChild(dropDiv);
            dropDiv.setAttribute('class', 'gdui-mobile gdui-tablet drop-element');
            dropDiv.style.display = '';

                const dropdown = document.createElement('button');
                dropDiv.appendChild(dropdown);
                dropdown.setAttribute('onclick', `dropClick('header')`);
                dropdown.setAttribute('class', `drop-element`);
                dropdown.style.height = '25px';
                dropdown.style.width = '25px';
                dropdown.style.marginRight = '15px';
                dropdown.style.marginLeft = '15px';
                dropdown.style.border = 'none';
                dropdown.style.background = 'none';
                dropdown.style.color = iconColor;
                dropdown.style.cursor = 'pointer';

                    const dropdownIcon = document.createElement('i');
                    dropdown.appendChild(dropdownIcon);
                    dropdownIcon.setAttribute('class', 'fa-solid fa-ellipsis-vertical fa-2xl drop-element');
                    dropdownIcon.setAttribute('onmouseenter', `icoHovEffect(this, 1)`);
                    dropdownIcon.setAttribute('onmouseleave', `icoHovEffect(this, 2)`);

                const dropMenu = document.createElement('div');
                dropDiv.appendChild(dropMenu);
                dropMenu.setAttribute('id', `header-dropmenu`);
                dropMenu.setAttribute('class', 'dropmenu drop-element');
                dropMenu.style.display = 'none';
                dropMenu.style.flexDirection = 'column';
                dropMenu.style.position = 'absolute';
                dropMenu.style.marginTop = '25px';
                dropMenu.style.backgroundColor = secondary;
                dropMenu.style.zIndex = '5';

                    const fileOrderDrop = document.createElement('button');
                    dropMenu.appendChild(fileOrderDrop);
                    fileOrderDrop.setAttribute('id', 'file-order');
                    fileOrderDrop.setAttribute('id', `drop-element`);
                    fileOrderDrop.setAttribute('onclick', 'reorderFiles(1)');
                    fileOrderDrop.style.margin = '10px';
                    fileOrderDrop.style.border = 'none';
                    fileOrderDrop.style.background = 'none';
                    fileOrderDrop.style.color = iconColor;
                    fileOrderDrop.style.cursor = 'pointer';
            
                        const fileOrderIconDrop = document.createElement('i');
                        fileOrderDrop.appendChild(fileOrderIconDrop);
                        fileOrderIconDrop.setAttribute('class', 'fa-sharp fa-solid fa-arrow-down-wide-short fa-2xl drop-element');
                        fileOrderIconDrop.setAttribute('onmouseenter', `icoHovEffect(this, 1)`);
                        fileOrderIconDrop.setAttribute('onmouseleave', `icoHovEffect(this, 2)`);
            
                    const appearanceDrop = document.createElement('button');
                    dropMenu.appendChild(appearanceDrop);
                    appearanceDrop.setAttribute('id', 'appearance');
                    appearanceDrop.setAttribute('class', 'drop-element')
                    appearanceDrop.setAttribute('onclick', 'explorerView(1)');
                    appearanceDrop.style.margin = '10px';
                    appearanceDrop.style.border = 'none';
                    appearanceDrop.style.background = 'none';
                    appearanceDrop.style.color = iconColor;
                    appearanceDrop.style.cursor = 'pointer';
            
                        const appearanceIconDrop = document.createElement('i');
                        appearanceDrop.appendChild(appearanceIconDrop);
                        appearanceIconDrop.setAttribute('class', 'fa-solid fa-list fa-2xl drop-element');
                        appearanceIconDrop.setAttribute('onmouseenter', `icoHovEffect(this, 1)`);
                        appearanceIconDrop.setAttribute('onmouseleave', `icoHovEffect(this, 2)`);

                    const selectDivDrop = document.createElement('Div');
                    dropMenu.appendChild(selectDivDrop);
                    selectDivDrop.setAttribute('class', 'drop-element');
                    selectDivDrop.setAttribute('onclick', `selectFiles('d-select-all-input', 1)`)
                    selectDivDrop.style.display = 'flex';
                    selectDivDrop.style.justifyContent = 'center';
                    selectDivDrop.style.backgroundColor = secondary;
                    selectDivDrop.style.paddingLeft = '8px';
                    selectDivDrop.style.margin = '10px';
                    selectDivDrop.style.color = 'black';
                    selectDivDrop.style.cursor = 'pointer';
            
                        const checkmarkDrop = document.createElement('i');
                        selectDivDrop.appendChild(checkmarkDrop);
                        checkmarkDrop.setAttribute('id', 'd-select-all-mark');
                        checkmarkDrop.setAttribute('class', 'fa-sharp fa-solid fa-check fa-sm drop-element');
                        checkmarkDrop.style.display = 'none';
                        checkmarkDrop.style.position = 'absolute';
                        checkmarkDrop.style.zIndex = '2';
                        checkmarkDrop.style.marginTop = '14px';
                        checkmarkDrop.style.marginLeft = '-6px';
                        checkmarkDrop.style.color = '#171717'

            
                        const selectSpanDrop = document.createElement('span');
                        selectDivDrop.appendChild(selectSpanDrop);
                        selectSpanDrop.setAttribute('id', 'd-select-all-span');
                        selectSpanDrop.setAttribute('class', 'drop-element')
                        selectSpanDrop.style.height = '25px';
                        selectSpanDrop.style.width = '25px';
                        selectSpanDrop.style.backgroundColor = '#d3d3d380';
                        selectSpanDrop.style.border = '1px solid #292929';
                        selectSpanDrop.style.display = 'block';
                        selectSpanDrop.style.zIndex = '1';
            
                        const selectAllDrop = document.createElement('input');
                        selectDivDrop.appendChild(selectAllDrop);
                        selectAllDrop.setAttribute('id', 'd-select-all-input');
                        selectAllDrop.setAttribute('class', 'drop-element');
                        selectAllDrop.setAttribute('type', 'checkbox');
                        selectAllDrop.setAttribute('onchange', 'checkVis(this)');
                        selectAllDrop.style.appearance = 'none';

                const refresh = document.createElement('button');
                iconsDiv.appendChild(refresh);
                refresh.setAttribute('id', 'refresh');
                refresh.setAttribute('onclick', 'refreshFiles()');
                refresh.style.marginRight = '3px';
                refresh.style.border = 'none';
                refresh.style.background = 'none';
                refresh.style.color = iconColor;
                refresh.style.cursor = 'pointer';
                refresh.style.height = '2.5em';
                refresh.style.transform = 'rotate(0deg)';

                    const refreshIcon = document.createElement('i');
                    refresh.appendChild(refreshIcon);
                    refreshIcon.setAttribute('class', 'fa-sharp fa-solid fa-rotate fa-lg');
                    refreshIcon.setAttribute('onmouseenter', `icoHovEffect(this, 1, true)`);
                    refreshIcon.setAttribute('onmouseleave', `icoHovEffect(this, 2)`);

            const selectDiv = document.createElement('Div');
            iconsDiv.appendChild(selectDiv);
            selectDiv.setAttribute('onclick', `selectFiles('select-all-input', 1)`);
            selectDiv.setAttribute('onmouseenter', `icoHovEffect(this, 1, false, true)`);
            selectDiv.setAttribute('onmouseleave', `icoHovEffect(this, 2, false, true)`);
            selectDiv.setAttribute('class', 'gdui-desktop');
            selectDiv.style.display = 'flex';
            selectDiv.style.alignItems = 'center';
            selectDiv.style.backgroundColor = secondary;
            selectDiv.style.paddingRight = '8px';
            selectDiv.style.paddingLeft = '8px';
            selectDiv.style.color = 'black';
            selectDiv.style.height = '35px';
            selectDiv.style.cursor = 'pointer';

                const checkmark = document.createElement('i');
                selectDiv.appendChild(checkmark);
                checkmark.setAttribute('id', 'select-all-mark');
                checkmark.setAttribute('class', 'fa-sharp fa-solid fa-check fa-xs');
                checkmark.style.display = 'none';
                checkmark.style.position = 'absolute';
                checkmark.style.zIndex = '2';
                checkmark.style.color = '#171717'
                checkmark.style.marginLeft = '3px';

                const selectSpan = document.createElement('span');
                selectDiv.appendChild(selectSpan);
                selectSpan.setAttribute('id', 'select-all-span');
                selectSpan.style.height = '17px';
                selectSpan.style.width = '17px';
                selectSpan.style.backgroundColor = '#d3d3d380';
                selectSpan.style.border = '1px solid #292929';
                selectSpan.style.display = 'block';
                selectSpan.style.zIndex = '1';

                const selectAll = document.createElement('input');
                selectDiv.appendChild(selectAll);
                selectAll.setAttribute('id', 'select-all-input');
                selectAll.setAttribute('type', 'checkbox');
                selectAll.setAttribute('onchange', 'checkVis(this)');
                selectAll.style.appearance = 'none';

                const selectLabel = document.createElement('label');
                selectDiv.appendChild(selectLabel);
                selectLabel.setAttribute('id', 'select-all-label');
                selectLabel.setAttribute('for', 'select-all');
                selectLabel.style.color = 'white';
                selectLabel.innerText = 'Select All';
                selectLabel.style.cursor = 'pointer';
                selectLabel.style.fontSize = '14px';
    
    const headerSep = document.createElement('hr');
    googDiv.appendChild(headerSep);
    headerSep.style.borderColor = secondary;
    headerSep.style.width = '99%';


//UI file selector
const UIFileSelector = document.createElement('div');
googDiv.appendChild(UIFileSelector);
UIFileSelector.setAttribute('id', 'ui-file-selector');
UIFileSelector.style.paddingLeft = '35px';
UIFileSelector.style.paddingRight = '35px';
UIFileSelector.style.marginTop = '20px';
UIFileSelector.style.marginBottom ='20px';

    const folders = document.createElement('div');
    UIFileSelector.appendChild(folders);
    folders.style.display = 'flex';
    folders.style.flexDirection = 'row';
    folders.style.flexWrap = 'wrap';
    folders.style.marginBottom ='20px';


    const files = document.createElement('div');
    UIFileSelector.appendChild(files);
    files.setAttribute('id', 'file-div');
    files.style.display = 'flex';
    files.style.flexDirection = 'row';
    files.style.flexWrap = 'wrap';

//UI footer

const footerSep = document.createElement('hr');
googDiv.appendChild(footerSep);
footerSep.style.borderColor = '#171717';
footerSep.style.width = '99%'

const UIFooter = document.createElement('div');
googDiv.appendChild(UIFooter);
UIFooter.setAttribute('id', 'ui-footer');
UIFooter.style.backgroundColor = primary;
UIFooter.style.display = 'flex'
UIFooter.style.paddingTop = '10px';
UIFooter.style.paddingBottom = '10px';
UIFooter.style.paddingRight = '35px';

    const downloadButton = document.createElement('button');
    UIFooter.appendChild(downloadButton);
    downloadButton.setAttribute('id', 'download-button');
    downloadButton.setAttribute('onclick', 'downloadMulti()');
    downloadButton.setAttribute('onmouseenter', 'downHov(1)');
    downloadButton.setAttribute('onmouseleave', 'downHov(2)');
    downloadButton.innerText = 'DOWNLOAD';
    downloadButton.style.cursor = 'pointer';
    downloadButton.style.display = 'flex';
    downloadButton.style.justifyContent = 'center';
    downloadButton.style.alignItems = 'center';
    downloadButton.style.backgroundColor = 'transparent';
    downloadButton.style.color = '#ffffff80';
    downloadButton.style.border = '1px solid #ffffff80';
    downloadButton.style.fontWeight = '700'
    downloadButton.style.outline = 'none';
    downloadButton.style.height = '40px';
    downloadButton.style.cursor = '';

        const downloadImg = document.createElement('i');
        downloadButton.appendChild(downloadImg);
        downloadImg.setAttribute('class', 'fa-sharp fa-solid fa-download');
        downloadImg.style.marginLeft = '10px';



function cssChange() {
    const desktopDivs = Array.prototype.slice.call(document.getElementsByClassName('gdui-desktop'));
    const tabletDivs = Array.prototype.slice.call(document.getElementsByClassName('gdui-tablet'));
    const mobileDivs = Array.prototype.slice.call(document.getElementsByClassName('gdui-mobile'));
    const folderButtons = Array.prototype.slice.call(folders.getElementsByClassName('goog-folder'));
    const fileCard = Array.prototype.slice.call(files.getElementsByClassName('goog-drive-file'));
    const pathing = Array.prototype.slice.call(filepath.getElementsByClassName('mobile-folder'));
    const footFlex = Array.prototype.slice.call(files.getElementsByClassName('footFlex'));
    const driveFileName = Array.prototype.slice.call(files.getElementsByClassName('drive-file-name'));


    if (window.innerWidth >= 768 && window.innerWidth < 1024) {
        TabletCSS(desktopDivs, tabletDivs, mobileDivs, folderButtons, fileCard, pathing, footFlex, driveFileName);
    } else if (window.innerWidth < 768) {
        PhoneCSS(desktopDivs, tabletDivs, mobileDivs, folderButtons, fileCard, pathing, footFlex, driveFileName);
    } else {
        ComputerCSS(desktopDivs, tabletDivs, mobileDivs, folderButtons, fileCard, pathing, footFlex, driveFileName);
    };
};
cssChange();
GetDriveInfo(arrayPath[0], 1);

//Event Listeners
var resizeStop = null;
function resizeChecker() {
    clearTimeout(resizeStop);
    resizeStop = setTimeout(cssChange, 100);
};
window.addEventListener('resize', resizeChecker);
