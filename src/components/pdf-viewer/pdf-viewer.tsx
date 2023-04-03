import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'pdf-viewer',
  styleUrl: 'pdf-viewer.css',
  shadow: true,
})
export class PDFViewer {

  render() {
    return (
      <Host>
        <p>PDF Viewer</p>
        <slot></slot>
      </Host>
    );
  }

}
