import { JwtGuard } from './../auth/guards/jwt.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { FolderElementService } from './folder-element.service';
import { CreateFolderElementDto, UpdateFolderElementDto } from './dto';
import { Roles } from '../roles/decorators/roles.decorator';

// @Roles
@UseGuards(JwtGuard)
@Controller('folder-element')
export class FolderElementController {
  constructor(private folderElementService: FolderElementService) {}

  @Get()
  getFolderElements() {
    return this.folderElementService.getFolderElements();
  }

  @Get(':id')
  getFolderElementById(@Param('id') folderElementId: string) {
    return this.folderElementService.getFolderElementById(folderElementId);
  }

  @Post()
  createFolderElement(@Body() dto: CreateFolderElementDto) {
    return this.folderElementService.createFolderElement(dto);
  }

  @Patch(':id')
  editFolderElement(
    @Body() dto: UpdateFolderElementDto,
    @Param('id') folderElementId: string,
  ) {
    return this.folderElementService.editFolderElement(folderElementId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteFolderElement(@Param('id') folderElementId: string) {
    return this.folderElementService.deleteFolderElement(folderElementId);
  }
}
